import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { sendOrderEmails } from "../services/orderEmailService.js";
import {sendOrderConfimation} from "../services/whatsapp.service.js"
import Offer from "../models/offerModel.js";
import Coupon from "../models/couponModel.js";
import { v4 as uuidv4 } from "uuid";
import Settings from "../models/settingsModel.js"

/**
 * Populate paths used when returning orders with related data.
 */
const orderPopulate = [
  { path: "orderedItems.productId", select: "name price image category isAvailable" },
  { path: "user", select: "name email phone role" },
  { path: "appliedOffer", select: "title discountType discountValue" },
  { path: "appliedCoupon", select: "code type value" },
];

/**
 * Map Mongoose errors to HTTP status codes before next(error).
 */
const handleMongooseError = (error, res) => {
  if (error.name === "CastError") {
    res.status(400);
    error.message = "Invalid ID";
  }
  if (error.name === "ValidationError") {
    res.status(400);
  }
  if (error.code === 11000) {
    res.status(409);
    error.message = "Duplicate order number, please try again";
  }
};

/**
 * Build line items and total from database prices (never trust client amounts).
 */
const buildOrderedItemsFromDb = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Order must contain at least one item");
    error.statusCode = 400;
    throw error;
  }

  const orderedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const { productId, quantity } = item;

    // ✅ FIX #3: quantity validation — negative ya zero quantity reject karo
    if (!productId || !quantity || quantity < 1) {
      const error = new Error("Each item must include productId and valid quantity (min 1)");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error(`Product not found: ${productId}`);
      error.statusCode = 404;
      throw error;
    }

    if (!product.isAvailable) {
      const error = new Error(`${product.name} is currently unavailable`);
      error.statusCode = 400;
      throw error;
    }

    const lineTotal = product.price * quantity;
    totalAmount += lineTotal;

    // ✅ FIX #4: category save karo — category scope offers ke liye zaroori
    orderedItems.push({
      productId: product._id,
      name: product.name,
      quantity,
      price: product.price,
      category: product.category,
    });
  }

  return { orderedItems, totalAmount };
};

// @desc    Place a new order (guest or logged-in)
// @route   POST /api/orders
// @access  Public (optional JWT attaches user)
export const createOrder = async (req, res, next) => {
  try {
    const { orderedItems, customerDetails, paymentMethod, couponCode } = req.body;

    // ✅ FIX #1: guestId pehle generate karo — orderPayload se pehle
    const guestId = !req.user?.id ? (req.guestId || uuidv4()) : null;

    if (!customerDetails?.name || !customerDetails?.phone || !customerDetails?.address) {
      res.status(400);
      throw new Error("Customer name, phone, and address are required");
    }

    if (!paymentMethod) {
      res.status(400);
      throw new Error("Payment method is required");
    }
    
    const settings = await Settings.findOne();

if (paymentMethod === "COD" && !settings?.codEnabled) {
  res.status(403);
  throw new Error("Cash on delivery is currently unavailable");
}

if (paymentMethod === "ONLINE" && !settings?.onlinePayEnabled) {
  res.status(403);
  throw new Error("Online payment is currently unavailable");
}



    const { orderedItems: validatedItems, totalAmount } =
      await buildOrderedItemsFromDb(orderedItems);

    // ── STEP 1: Offer apply karo ──────────────────────────────
    let offerDiscount = 0;
    let appliedOffer = null;
    const now = new Date();

    const activeOffers = await Offer.find({
      isActive: true,
      $and: [
        { $or: [{ startDate: { $lte: now } }, { startDate: null }] },
        { $or: [{ endDate: { $gte: now } }, { endDate: null }] },
      ],
    });

    // Best matching offer dhundo (highest discount)
    for (const offer of activeOffers) {
      if (offer.minimumOrder && totalAmount < offer.minimumOrder) continue;
      if (offer.minimumCartValue && totalAmount < offer.minimumCartValue) continue;

      let applicable = false;

      if (offer.scope === "menu") {
        applicable = true;
      } else if (offer.scope === "category") {
        applicable = validatedItems.some((item) =>
          offer.applicableCategories?.some(
            (cat) => cat.toString() === item.category?.toString()
          )
        );
      } else if (offer.scope === "product") {
        applicable = validatedItems.some((item) =>
          offer.applicableProducts?.some(
            (p) => p.toString() === item.productId.toString()
          )
        );
      }

      if (!applicable) continue;

      let discount = 0;
      if (offer.discountType === "percentage") {
        discount = (totalAmount * offer.discountValue) / 100;
        if (offer.maximumDiscount) discount = Math.min(discount, offer.maximumDiscount);
      } else if (offer.discountType === "fixed") {
        discount = offer.discountValue;
      }

      if (discount > offerDiscount) {
        offerDiscount = discount;
        appliedOffer = offer._id;
      }
    }

    offerDiscount = Math.min(Math.round(offerDiscount), totalAmount);

    // ── STEP 2: Coupon apply karo ─────────────────────────────
    let couponDiscount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (
        coupon &&
        (!coupon.startDate || now >= coupon.startDate) &&
        (!(coupon.expiryDate || coupon.endDate) || now <= (coupon.expiryDate || coupon.endDate)) &&
        (!coupon.minimumOrder || totalAmount >= coupon.minimumOrder) &&
        (!coupon.totalUsageLimit || coupon.usedCount < coupon.totalUsageLimit)
      ) {
        if (coupon.type === "percentage") {
          couponDiscount = (totalAmount * coupon.value) / 100;
          if (coupon.maximumDiscount)
            couponDiscount = Math.min(couponDiscount, coupon.maximumDiscount);
        } else if (coupon.type === "fixed") {
          couponDiscount = coupon.value;
        }

        couponDiscount = Math.min(Math.round(couponDiscount), totalAmount);
        appliedCoupon = coupon._id;
      }
    }

    // ── STEP 3: Final amount calculate karo ──────────────────
    const finalAmount = Math.max(0, totalAmount - offerDiscount - couponDiscount);

    // ✅ FIX #1: user ya guestId — ek jagah handle, duplicate nahi
    const orderPayload = {
      orderedItems: validatedItems,
      customerDetails,
      paymentMethod,
      totalAmount,
      offerDiscount,
      couponDiscount,
      finalAmount,
      ...(appliedOffer && { appliedOffer }),
      ...(appliedCoupon && { appliedCoupon }),
      ...(req.user?.id ? { user: req.user.id } : { guestId }),
    };

    const order = await Order.create(orderPayload);

    // Coupon usedCount increment — sirf successful order ke baad
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon, { $inc: { usedCount: 1 } });
    }

    const populatedOrder = await Order.findById(order._id).populate(orderPopulate);
    try{
          await sendOrderConfimation(populatedOrder)
    }catch(error){
      console.error("WhatsApp Failed:", error.message);
    }

      try{
       await sendOrderEmails(populatedOrder);
      }catch(error){
        console.error("Email service failed",error.message)
      }

    const io = req.app.get("io");
    io.emit("new-order", {
      message: "New Order Received",
      order: populatedOrder,
    });

    res.status(201).json({
      success: true,
      guestId: order.guestId || null,
      data: populatedOrder,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      orderStatus,
      paymentStatus,
      paymentMethod,
      orderNumber,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (orderNumber) {
      filter.orderNumber = { $regex: orderNumber, $options: "i" };
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Admin, logged-in owner, or guest with matching guestId
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(orderPopulate);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // ✅ FIX #2: Guest support — req.user nahi hoga toh crash nahi karega
    if (req.user?.id) {
      // Logged-in: admin ya order owner check karo
      const currentUser = await User.findById(req.user.id).select("role");

      if (!currentUser) {
        res.status(401);
        throw new Error("Not authorized");
      }

      const isAdmin =
        currentUser.role === "admin" || currentUser.role === "superAdmin";
      const orderUserId =
        order.user?._id?.toString() || order.user?.toString();
      const isOwner = orderUserId === req.user.id.toString();

      if (!isAdmin && !isOwner) {
        res.status(403);
        throw new Error("Not authorized to view this order");
      }
    } else {
      // Guest: guestId se verify karo
      const requestGuestId = req.guestId;
      if (!requestGuestId || order.guestId !== requestGuestId) {
        res.status(403);
        throw new Error("Not authorized to view this order");
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      res.status(400);
      throw new Error("orderStatus is required");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.orderStatus = orderStatus;

    // COD orders marked Delivered are treated as paid on delivery
    if (orderStatus === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id).populate(orderPopulate);

    res.status(200).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Track order by orderNumber (public — guests can track too)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const trackingData = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      offerDiscount: order.offerDiscount,
      couponDiscount: order.couponDiscount,
      finalAmount: order.finalAmount,
      orderedItems: order.orderedItems,
      customerDetails: {
        name: order.customerDetails.name,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};