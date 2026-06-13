import express from "express";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  getContactById,
} from "../controllers/contactController.js";

import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/", submitContact);

// ADMIN
router.get("/", protect, adminOnly, getAllContacts);
router.get("/:id", protect, adminOnly, getContactById);
router.patch("/:id/status", protect, adminOnly, updateContactStatus);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;