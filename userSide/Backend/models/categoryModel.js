import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },

    // Optional - useful for future SEO-friendly URLs
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Controls display order in menu/admin panel
    displayOrder: {
      type: Number,
      default: 0,
    },

    // Soft delete instead of removing category permanently
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional future index if slug becomes important
// categorySchema.index(
//   { slug: 1 },
//   { unique: true, sparse: true }
// );

const Category = mongoose.model("Category", categorySchema);

export default Category;