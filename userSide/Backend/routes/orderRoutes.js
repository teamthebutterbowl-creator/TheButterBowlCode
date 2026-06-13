import express from "express";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  trackOrder,
} from "../controllers/orderController.js";
import protect, { optionalAuth } from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";


const router = express.Router();

// POST /api/orders — public (guest checkout); optional JWT links order to user
router.post("/", optionalAuth, createOrder);

// GET /api/orders/my-orders — logged-in user only (must be before /:id)
router.get("/my-orders", protect, getMyOrders);

// GET /api/orders/track/:orderNumber — public order tracking (must be before /:id)
router.get("/track/:orderNumber", trackOrder);

// GET /api/orders — admin only
router.get("/", protect, adminOnly, getAllOrders);

// GET /api/orders/:id — admin or order owner
router.get("/:id", protect, getOrderById);

// PUT /api/orders/:id/status — admin only
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;
