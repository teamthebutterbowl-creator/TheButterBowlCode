import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { uploadProductImage } from "../middleware/upload.js";

const router = express.Router();

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getSingleProduct);

// POST /api/products (multipart field "image" optional)
router.post("/", uploadProductImage, createProduct);

// PUT /api/products/:id (multipart field "image" optional)
router.put("/:id", uploadProductImage, updateProduct);

// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

export default router;
