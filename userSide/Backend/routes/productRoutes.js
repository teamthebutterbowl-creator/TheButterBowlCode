import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleBestSeller,
  toggleFeaturedProduct,
  toggleProductAvailability
} from "../controllers/productController.js";
import { uploadProductImage } from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET /api/products
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// create product
router.post("/", protect, adminOnly,   uploadProductImage,createProduct);

// update product
router.put("/:id", protect, adminOnly,uploadProductImage, updateProduct);

// soft delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

// toggle controls
router.patch(
  "/:id/toggle-availability",
  protect,
  adminOnly,
  toggleProductAvailability
);

router.patch(
  "/:id/toggle-featured",
  protect,
  adminOnly,
  toggleFeaturedProduct
);

router.patch(
  "/:id/toggle-bestseller",
  protect,
  adminOnly,
  toggleBestSeller
);

export default router;
