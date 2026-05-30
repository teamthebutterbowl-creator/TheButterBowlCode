import Product from "../models/productModel.js";
import { deleteCloudinaryImage } from "../config/cloudinary.js";

/**
 * Handle Mongoose CastError (invalid ObjectId) and ValidationError status codes
 * before passing to the centralized error handler.
 */
const handleMongooseError = (error, res) => {
  if (error.name === "CastError") {
    res.status(400);
    error.message = "Invalid product ID";
  }
  if (error.name === "ValidationError") {
    res.status(400);
  }
};

/**
 * Build product fields from req.body (multipart sends strings).
 */
const parseProductFields = (body) => {
  const data = {
    name: body.name,
    description: body.description,
    price: Number(body.price),
    category: body.category,
  };

  if (body.isAvailable !== undefined) {
    data.isAvailable =
      body.isAvailable === "true" || body.isAvailable === true;
  }

  return data;
};

/**
 * Image URL: uploaded file (Cloudinary) takes priority over body string.
 */
const resolveImageUrl = (req) => {
  if (req.file?.path) {
    console.log("Using Cloudinary image from upload:", req.file.path);
    return req.file.path;
  }

  if (req.body.image) {
    console.log("Using image URL from request body:", req.body.image);
    return req.body.image;
  }

  return undefined;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (admin — protect in routes later)
export const createProduct = async (req, res, next) => {
  try {
    console.log("createProduct — building product data");

    const productData = parseProductFields(req.body);
    const imageUrl = resolveImageUrl(req);

    if (imageUrl) {
      productData.image = imageUrl;
    }

    const product = await Product.create(productData);

    console.log("Product created:", product._id);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// Fields clients are allowed to change (ignores _id, timestamps, etc. from Postman)
const PRODUCT_UPDATE_FIELDS = [
  "name",
  "description",
  "price",
  "image",
  "category",
  "isAvailable",
];

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (admin — protect in routes later)
export const updateProduct = async (req, res, next) => {
  try {
    console.log("updateProduct — id:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const updates = PRODUCT_UPDATE_FIELDS.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, {});

    if (req.body.price !== undefined) {
      updates.price = Number(req.body.price);
    }

    if (req.body.isAvailable !== undefined) {
      updates.isAvailable =
        req.body.isAvailable === "true" || req.body.isAvailable === true;
    }

    // New file uploaded → replace image and remove old Cloudinary asset
    if (req.file?.path) {
      console.log("New image uploaded — replacing old image");

      if (product.image) {
        try {
          await deleteCloudinaryImage(product.image);
        } catch (deleteErr) {
          console.log("Failed to delete old Cloudinary image:", deleteErr.message);
        }
      }

      updates.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("Product updated:", updatedProduct._id);

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (admin — protect in routes later)
export const deleteProduct = async (req, res, next) => {
  try {
    console.log("deleteProduct — id:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.image) {
      try {
        await deleteCloudinaryImage(product.image);
      } catch (deleteErr) {
        console.log("Cloudinary delete warning:", deleteErr.message);
      }
    }

    await product.deleteOne();

    console.log("Product deleted from database:", req.params.id);

    res.status(200).json({
      success: true,
      message: "Product removed successfully",
      data: product,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};
