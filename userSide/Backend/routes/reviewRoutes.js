// routes/reviewRoutes.js

import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post("/", addReview);

// Admin — saare reviews (must be BEFORE /:productId)
router.get("/", protect, roleMiddleware("admin", "superAdmin"), getAllReviews);

// Public — specific product ke reviews
router.get("/:productId", getProductReviews);

// Admin — delete
router.delete("/:id", protect, roleMiddleware("admin", "superAdmin"), deleteReview);
export default router;