import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon, 
} from "../controllers/couponController.js";
import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();
router.post("/validate", validateCoupon);
router.get("/", protect, adminOnly, getAllCoupons);
router.post("/", protect, adminOnly, createCoupon);
router.put("/:id", protect, adminOnly, updateCoupon);
router.patch("/:id/toggle", protect, adminOnly, toggleCouponStatus);
router.delete("/:id", protect, adminOnly, deleteCoupon);


export default router;