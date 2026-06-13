import express from "express";
import {
  createOffer,
  getActiveOffers,
  getAllOffers,
  updateOffer,
  toggleOfferStatus,
  deleteOffer,
} from "../controllers/offerController.js";

import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();

// ------------------
// PUBLIC
// ------------------
router.get("/active", getActiveOffers);

// ------------------
// ADMIN ONLY
// ------------------
router.post("/", protect, adminOnly, createOffer);
router.get("/", protect, adminOnly, getAllOffers);
router.put("/:id", protect, adminOnly, updateOffer);
router.patch("/:id/toggle", protect, adminOnly, toggleOfferStatus);
router.delete("/:id", protect, adminOnly, deleteOffer);

export default router;