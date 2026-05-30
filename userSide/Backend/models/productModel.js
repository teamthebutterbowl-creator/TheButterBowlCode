import mongoose from "mongoose";

/**
 * Product schema for cloud kitchen menu items.
 * Timestamps add createdAt and updatedAt automatically.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    // URL or path to product image (optional)
    image: {
      type: String,
      trim: true,
    },
    // e.g. "Burgers", "Beverages" — optional for flexible categorization later
    category: {
      type: String,
      trim: true,
    },
    // Toggle when an item is out of stock without deleting it
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// "Product" is the model name; MongoDB collection will be "products" (lowercase, plural)
const Product = mongoose.model("Product", productSchema);

export default Product;
