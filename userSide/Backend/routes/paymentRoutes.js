// Express Router — groups payment routes in one file
import express from "express";
// Payment controller functions
import {
  createRazorpayOrder,
  verifyPayment,
  handleCOD,
} from "../controllers/paymentController.js";
// JWT auth middleware — required for protected payment routes
import { optionalAuth } from "../middleware/authMiddleware.js";

// Create a new router instance for payment routes
const router = express.Router();

// POST /api/payment/create-order — create Razorpay order (logged-in users)
router.post("/create-order", optionalAuth, createRazorpayOrder);

// POST /api/payment/verify — verify Razorpay payment after checkout (logged-in users)
router.post("/verify", optionalAuth, verifyPayment);

// POST /api/payment/cod — confirm COD order (public — guests allowed)
router.post("/cod", handleCOD);

// Export router so app.js can mount it at /api/payment
export default router;
