// Built-in Node.js module used to verify Razorpay payment signatures (HMAC SHA256)
import crypto from "crypto";
// Razorpay official SDK — used to create orders on Razorpay's servers
import Razorpay from "razorpay";
// Our MongoDB Order model
import Order from "../models/orderModel.js";
import Settings from "../models/settingsModel.js"
import { sendOrderEmails } from "../services/orderEmailService.js";
import {sendOrderConfimation} from "../services/whatsapp.service.js"


const orderPopulate = [
  { path: "orderedItems.productId", select: "name price image category isAvailable" },
  { path: "user", select: "name email phone role" },
  { path: "appliedOffer", select: "title discountType discountValue" },
  { path: "appliedCoupon", select: "code type value" },
];
// ✅ Memoized instance — credentials missing ho toh startup pe hi fail hoga
let _razorpayInstance = null;

const getRazorpayInstance = () => {
  if (_razorpayInstance) return _razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env");
  }

  _razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return _razorpayInstance;
};

// @desc    Create Razorpay order for ONLINE payment
// @route   POST /api/payment/create-order
// @access  Public (optionalAuth)
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400);
      throw new Error("orderId is required");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

     const settings = await Settings.findOne();
         if (!settings?.onlinePayEnabled) {
      res.status(403);
      throw new Error("Online payment is currently disabled");
    }

    // ONLINE payments only
    if (order.paymentMethod !== "ONLINE") {
      res.status(400);
      throw new Error("This endpoint is only for ONLINE payment method");
    }

    // ✅ FIX #4: Race condition — atomic lock
    // findOneAndUpdate atomically check + update karta hai
    // Agar do requests ek saath aayein toh sirf ek hi "pending" state milegi
    const lockedOrder = await Order.findOneAndUpdate(
      { _id: orderId, paymentStatus: "pending" },
      { $set: { paymentStatus: "processing" } },
      { new: true }
    );

    if (!lockedOrder) {
      res.status(400);
      throw new Error("Payment already in progress or completed");
    }

   
    const billableAmount = order.finalAmount > 0 ? order.finalAmount : order.totalAmount;

    if (!billableAmount || billableAmount <= 0) {
      res.status(400);
      throw new Error("Invalid order amount");
    }

    const amountInPaise = Math.round(billableAmount * 100);

    const razorpay = getRazorpayInstance();

    // receipt max 40 characters
    const receipt = (order.orderNumber || order._id.toString()).slice(0, 40);
    let razorpayOrder;
  try{
     razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        mongoOrderId: order._id.toString(),
      },
    });
  }catch (razorpayError) {
    // Rollback — processing → pending
    await Order.findByIdAndUpdate(orderId, {
      $set: { paymentStatus: "pending" },
    });
    throw razorpayError;
  }
   
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature after checkout
// @route   POST /api/payment/verify
// @access  Public (optionalAuth)
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;
    console.log(req.body)

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      res.status(400);
      throw new Error(
        "razorpay_order_id, razorpay_payment_id, razorpay_signature, and orderId are required"
      );
    }

    const order = await Order.findOne({
      _id: orderId,
      paymentStatus: "processing",
    });
    console.log("order in verify",order);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.paymentMethod !== "ONLINE") {
      res.status(400);
      throw new Error("This endpoint is only for ONLINE payment method");
    }

    // ✅ FIX #3: Guest ownership verify karo
    const isOwner = req.user?.id
      ? order.user?.toString() === req.user.id.toString()
      : order.guestId && order.guestId === req.guestId;

    if (!isOwner) {
      res.status(403);
      throw new Error("Not authorized to verify this order");
    }

    // ✅ razorpayOrderId match karo — tampered orderId detect hoga
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      res.status(400);
      throw new Error("Razorpay order ID mismatch");
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET is not set");
    }

    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signBody)
      .digest("hex");

    // timingSafeEqual — timing attack safe
    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
      );
    } catch {
      isValid = false;
    }
    if (!isValid) {
      await Order.findOneAndUpdate(
        { _id: orderId, paymentStatus: "processing" },
        { $set: { paymentStatus: "failed",  orderStatus: "Cancelled", } }
      );
      res.status(400);
      throw new Error("Invalid payment signature");
    }
    
    // Atomic update — prevents double confirmation
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        paymentStatus: "processing",
        razorpayOrderId: razorpay_order_id,
      },
      { $set: { paymentStatus: "paid", orderStatus: "Confirmed" } },
      { new: true }
    );

    
    if (!updatedOrder) {
      res.status(400);
      throw new Error("Order already processed or Razorpay ID mismatch");
    }
    console.log("order popultae",orderPopulate);
    const populatedOrder = await Order.findById(updatedOrder._id).populate(orderPopulate);
    try {
  await sendOrderConfimation(populatedOrder);
} catch (error) {
  console.error("WhatsApp Failed:", error.message);
}

try {
  await sendOrderEmails(populatedOrder);
} catch (error) {
  console.error("Email service failed", error.message);
}

const io = req.app.get("io");
io.emit("new-order", {
  message: "New Order Received",
  order: populatedOrder,
});
    
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: populatedOrder,
    });
    
  } catch (error) {
  
    next(error);
  }
};

// @desc    Confirm COD order (no online payment)
// @route   POST /api/payment/cod
// @access  Public (optionalAuth)
export const handleCOD = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400);
      throw new Error("orderId is required");
    }
      const settings = await Settings.findOne();
    if (!settings?.codEnabled) {
      res.status(403);
      throw new Error("Cash on delivery is currently disabled");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.paymentMethod !== "COD") {
      res.status(400);
      throw new Error("This endpoint is only for COD payment method");
    }
     // ✅ Guest ownership verify karo
const isOwner = req.user?.id
? order.user?.toString() === req.user.id.toString()
: order.guestId && order.guestId === req.guestId;

if (!isOwner) {
res.status(403);
throw new Error("Not authorized to confirm this order");
}

// Atomic update — duplicate confirmation bhi handle hogi
const updatedOrder = await Order.findOneAndUpdate(
{
  _id: orderId,
  paymentMethod: "COD",
  orderStatus: { $ne: "Confirmed" },
},
{ $set: { orderStatus: "Confirmed" } },
{ new: true }
);

if (!updatedOrder) {
res.status(400);
throw new Error("Order already confirmed");
}

res.status(200).json({
success: true,
message: "COD order confirmed successfully",
data: updatedOrder,
});
    
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel online payment
// @route   PUT /api/payment/cancel/:orderId
// @access  Public (optionalAuth)

export const cancelPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      paymentMethod: "ONLINE",
      paymentStatus: "processing",
    });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Owner verification
    const isOwner = req.user?.id
      ? order.user?.toString() === req.user.id.toString()
      : order.guestId && order.guestId === req.guestId;

    if (!isOwner) {
      res.status(403);
      throw new Error("Not authorized");
    }

    await Order.findByIdAndUpdate(orderId, {
      $set: {
        paymentStatus: "failed",
        orderStatus: "Cancelled",
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment cancelled",
    });
  } catch (error) {
    next(error);
  }
};