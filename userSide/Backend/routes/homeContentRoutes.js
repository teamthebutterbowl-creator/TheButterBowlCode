import express from "express";
import {
  upsertHomeContent,
  getHomeContent,
} from "../controllers/homeContentController.js";

import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";
const router = express.Router();

// PUBLIC — frontend homepage
router.get("/", getHomeContent);

// ADMIN — create/update CMS
router.post(
  "/",
  protect,
  adminOnly,
  upsertHomeContent
);

export default router;