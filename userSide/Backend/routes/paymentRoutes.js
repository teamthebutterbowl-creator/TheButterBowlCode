import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  handleCOD,
  cancelPayment
} from "../controllers/paymentController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many payment requests. Please try again later.",
  },
});

// POST /api/payment/create-order
router.post("/create-order", paymentLimiter, optionalAuth, createRazorpayOrder);

// POST /api/payment/verify
router.post("/verify", paymentLimiter, optionalAuth, verifyPayment);

// POST /api/payment/cod
router.post("/cod", paymentLimiter, optionalAuth, handleCOD);

router.put("/cancel/:orderId", optionalAuth, cancelPayment);

export default router;