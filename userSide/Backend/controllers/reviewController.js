// controllers/reviewController.js
import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

/**
 * Helper — calculate average rating for a product
 * Jab bhi review add/delete ho, ye call karna
 */
const calcAverageRating = async (productId) => {
  // Aggregate — us product ke saare reviews ka average nikalo
  const result = await Review.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  console.log("Rating calculation result:", result);
    // (Product model mein averageRating field add karni hogi — Step 3 mein karenge)
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: result[0].avgRating.toFixed(1),  // e.g. 4.3
      totalReviews: result[0].totalReviews,            // e.g. 12
    });
  } else {
    // Koi review nahi — reset karo
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Add a new review for a product
// @route   POST /api/reviews
// @access  Public (website users + admin for other platforms)
// ─────────────────────────────────────────────────────────────
export const addReview = async (req, res, next) => {
  try {
    const { productId, customerName, rating, comment, source } = req.body;

    // Check — product exist karta hai?
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Review create karo
    const review = await Review.create({
      productId,
      customerName,
      rating,
      comment,
      source: source || "website",
    });

    // Average rating recalculate karo
    await calcAverageRating(productId);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
// ─────────────────────────────────────────────────────────────
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check — product exist karta hai?
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Us product ke saare reviews lao — latest pehle
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Delete a review (admin only)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // ProductId save karo — delete ke baad rating recalculate karni hai
    const productId = review.productId;

    await review.deleteOne();

    // Rating recalculate karo
    await calcAverageRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all reviews (admin — for analysis)
// @route   GET /api/reviews
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────
export const getAllReviews = async (req, res, next) => {
  try {
    // Optional filter by source
    const filter = {};
    if (req.query.source) {
      filter.source = req.query.source;
    }

    const reviews = await Review.find(filter)
      .populate("productId", "name category") // product ka naam bhi lao
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};