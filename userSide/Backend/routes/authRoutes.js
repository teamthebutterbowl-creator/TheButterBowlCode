import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  resendResetEmail,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me (protected)
router.get("/me", protect, getMe);
//forgot password
router.post("/forgot-password", forgotPassword);
//resend rest
router.post("/resend-reset", resendResetEmail);
//reset password
router.post("/reset-password/:token", resetPassword);

export default router;

