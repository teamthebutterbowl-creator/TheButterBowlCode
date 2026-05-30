// Built-in Node.js module used to verify Razorpay payment signatures (HMAC SHA256)
import crypto from "crypto";
// Razorpay official SDK — used to create orders on Razorpay's servers
import Razorpay from "razorpay";
// Our MongoDB Order model
import Order from "../models/orderModel.js";

/**
 * Create and return a Razorpay client using credentials from .env
 */
const getRazorpayInstance = () => {
  // Read Razorpay Key ID from environment variables
  const keyId = process.env.RAZORPAY_KEY_ID;
  // Read Razorpay Key Secret from environment variables
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Stop early if credentials are missing
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env");
  }

  // Return a configured Razorpay instance
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// @desc    Create Razorpay order for ONLINE payment
// @route   POST /api/payment/create-order
// @access  Private (protect middleware)
export const createRazorpayOrder = async (req, res, next) => {
  try {
    // Read MongoDB order id from request body
    const { orderId } = req.body;

    // Debug log — which order we are processing
    console.log("Creating Razorpay order for orderId:", orderId);

    // Validate orderId is provided
    if (!orderId) {
      // Set HTTP status to 400 Bad Request
      res.status(400);
      // Throw error for centralized error handler
      throw new Error("orderId is required");
    }

    // Fetch the order from MongoDB by _id
    const order = await Order.findById(orderId);

    // Debug log — did we find the order?
    console.log("Fetched order from DB:", order ? order.orderNumber : "NOT FOUND");

    // If order does not exist, return 404
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // ONLINE payments only — reject COD orders
    if (order.paymentMethod !== "ONLINE") {
      res.status(400);
      throw new Error("This endpoint is only for ONLINE payment method");
    }

    // Only create Razorpay order if payment is still pending
    if (order.paymentStatus !== "pending") {
      res.status(400);
      throw new Error(`Payment is already ${order.paymentStatus}`);
    }

    // Convert rupees to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(order.totalAmount * 100);

    // Debug log — amount being sent to Razorpay
    console.log("Razorpay amount (paise):", amountInPaise);

    // Get Razorpay SDK instance
    const razorpay = getRazorpayInstance();

    // Create order on Razorpay servers
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber || order._id.toString(),
      notes: {
        mongoOrderId: order._id.toString(),
      },
    });

    // Debug log — Razorpay order created successfully
    console.log("Razorpay order created:", razorpayOrder.id);

    // Send Razorpay details to frontend so checkout can open
    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // Log error for debugging
    console.log("createRazorpayOrder error:", error.message);
    // Pass error to Express error handler
    next(error);
  }
};

// @desc    Verify Razorpay payment signature after checkout
// @route   POST /api/payment/verify
// @access  Private (protect middleware)
export const verifyPayment = async (req, res, next) => {
  try {
    // Read payment details sent from frontend after Razorpay checkout
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Debug log — start verification
    console.log("Verifying payment for orderId:", orderId);
    console.log("Razorpay order id:", razorpay_order_id);
    console.log("Razorpay payment id:", razorpay_payment_id);

    // Ensure all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      res.status(400);
      throw new Error(
        "razorpay_order_id, razorpay_payment_id, razorpay_signature, and orderId are required"
      );
    }

    // Fetch our order from MongoDB
    const order = await Order.findById(orderId);

    // Debug log — order lookup result
    console.log("Fetched order for verify:", order ? order.orderNumber : "NOT FOUND");

    // Order must exist
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // This endpoint is only for ONLINE orders
    if (order.paymentMethod !== "ONLINE") {
      res.status(400);
      throw new Error("This endpoint is only for ONLINE payment method");
    }

    // Build the string Razorpay uses for signature: order_id|payment_id
    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature using HMAC SHA256 and our secret key
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest("hex");

    // Debug log — compare signatures (do not log full secret)
    console.log("Signature match:", expectedSignature === razorpay_signature);

    // Compare expected signature with signature from Razorpay
    const isValid = expectedSignature === razorpay_signature;

    // If signature is invalid, mark payment as failed
    if (!isValid) {
      console.log("Invalid payment signature — marking order as failed");
      order.paymentStatus = "failed";
      await order.save();
      res.status(400);
      throw new Error("Invalid payment signature");
    }

    // Signature valid — mark payment as paid
    console.log("Payment verified — updating paymentStatus to paid");
    order.paymentStatus = "paid";
    order.orderStatus = "Confirmed";
    await order.save();

    // Return success response with updated order
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (error) {
    console.log("verifyPayment error:", error.message);
    next(error);
  }
};

// @desc    Confirm COD order (no online payment)
// @route   POST /api/payment/cod
// @access  Public (guests and logged-in users)
export const handleCOD = async (req, res, next) => {
  try {
    // Read MongoDB order id from request body
    const { orderId } = req.body;

    // Debug log
    console.log("Handling COD for orderId:", orderId);

    // Validate orderId
    if (!orderId) {
      res.status(400);
      throw new Error("orderId is required");
    }

    // Fetch order from database
    const order = await Order.findById(orderId);

    // Debug log
    console.log("COD order fetched:", order ? order.orderNumber : "NOT FOUND");

    // Order must exist
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // This endpoint is only for Cash on Delivery
    if (order.paymentMethod !== "COD") {
      res.status(400);
      throw new Error("This endpoint is only for COD payment method");
    }

    // Confirm the order — kitchen can start preparing
    console.log("Updating COD orderStatus to Confirmed");
    order.orderStatus = "Confirmed";

    // paymentStatus stays "pending" until delivery (admin sets paid on Delivered)
    const updatedOrder = await order.save();

    // Debug log — success
    console.log("COD order confirmed:", updatedOrder.orderNumber);

    // Return success message and order details
    res.status(200).json({
      success: true,
      message: "COD order confirmed successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log("handleCOD error:", error.message);
    next(error);
  }
};
