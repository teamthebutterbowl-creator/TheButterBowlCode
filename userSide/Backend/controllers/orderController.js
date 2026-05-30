import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

/**
 * Populate paths used when returning orders with related data.
 */
const orderPopulate = [
  { path: "orderedItems.productId", select: "name price image category isAvailable" },
  { path: "user", select: "name email phone role" },
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

    if (!productId || !quantity) {
      const error = new Error("Each item must include productId and quantity");
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

    orderedItems.push({
      productId: product._id,
      name: product.name,
      quantity,
      price: product.price,
    });
  }

  return { orderedItems, totalAmount };
};

// @desc    Place a new order (guest or logged-in)
// @route   POST /api/orders
// @access  Public (optional JWT attaches user)
export const createOrder = async (req, res, next) => {
  try {
    const { orderedItems, customerDetails, paymentMethod } = req.body;

    if (!customerDetails?.name || !customerDetails?.phone || !customerDetails?.address) {
      res.status(400);
      throw new Error("Customer name, phone, and address are required");
    }

    if (!paymentMethod) {
      res.status(400);
      throw new Error("Payment method is required");
    }

    const { orderedItems: validatedItems, totalAmount } =
      await buildOrderedItemsFromDb(orderedItems);

    const orderPayload = {
      orderedItems: validatedItems,
      customerDetails,
      paymentMethod,
      totalAmount,
    };

    // Logged-in user: optionalAuth sets req.user from JWT
    if (req.user?.id) {
      orderPayload.user = req.user.id;
    }

    const order = await Order.create(orderPayload);
    await order.populate(orderPopulate);

    res.status(201).json({
      success: true,
      data: order,
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
    const filter = {};

    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
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
// @access  Private (admin or order owner)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(orderPopulate);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

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

    res.status(200).json({
      success: true,
      data: order,
    });
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
    await updatedOrder.populate(orderPopulate);

    res.status(200).json({
      success: true,
      data: updatedOrder,
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
    // Read orderNumber from URL (e.g. ORD-1748513847362-X4KP)
    const { orderNumber } = req.params;

    // Debug: which order the client is looking for
    console.log("trackOrder — searching for orderNumber:", orderNumber);

    // Find one order where orderNumber matches (not MongoDB _id)
    const order = await Order.findOne({ orderNumber });

    // Debug: did we find it?
    console.log("trackOrder — order found:", order ? "yes" : "no");

    // If no order with that number, return 404
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Build response with only fields safe to show on a tracking page
    const trackingData = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      orderedItems: order.orderedItems,
      customerDetails: {
        name: order.customerDetails.name,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    // Debug: sending tracking response
    console.log("trackOrder — returning status:", order.orderStatus);

    // Send success response (no password, no full address required for basic track)
    res.status(200).json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    // Pass errors to centralized error handler
    console.log("trackOrder error:", error.message);
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
