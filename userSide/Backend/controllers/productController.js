import Product from "../models/productModel.js";
import { deleteCloudinaryImage } from "../config/cloudinary.js";

/**
 * Handle Mongoose CastError and ValidationError status codes
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
 * Resolve images from the request.
 * Priority: uploaded files (Cloudinary) > body image URLs
 * Always returns an array or undefined.
 */
const resolveImages = (req) => {
  // Multiple file upload (upload.array)
  if (req.files?.length) {
    return req.files.map((f) => f.path);
  }

  // Single file upload (upload.single)
  if (req.file?.path) {
    return [req.file.path];
  }

  // URL strings from body
  if (req.body.images) {
    return Array.isArray(req.body.images)
      ? req.body.images
      : req.body.images.split(",").map((s) => s.trim());
  }

  return undefined;
};

/**
 * Build product fields from req.body (multipart sends strings).
 * Only defined fields are included — undefined fields are skipped
 * so partial updates don't wipe existing values.
 */
const parseProductFields = (body) => {
  console.log("BODY RECEIVED:", body);
  const data = {};

  if (body.name      !== undefined) data.name        = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.price     !== undefined) data.price       = Number(body.price);
  if (body.category  !== undefined) data.category    = body.category;
  if (body.type      !== undefined) data.type        = body.type;
  if (body.displayOrder !== undefined) data.displayOrder = Number(body.displayOrder);

  if (body.isAvailable !== undefined) {
    data.isAvailable = body.isAvailable === "true" || body.isAvailable === true;
  }

  if (body.isVeg !== undefined) {
    data.isVeg = body.isVeg === "true" || body.isVeg === true;
  }

  if (body.isFeatured !== undefined) {
    data.isFeatured = body.isFeatured === "true" || body.isFeatured === true;
  }

  if (body.isBestSeller !== undefined) {
    data.isBestSeller = body.isBestSeller === "true" || body.isBestSeller === true;
  }

  if (body.includes) {
    data.includes = Array.isArray(body.includes)
      ? body.includes
      : body.includes.split(",").map((s) => s.trim());
  }

  if (body.ingredients) {
    data.ingredients = Array.isArray(body.ingredients)
      ? body.ingredients
      : body.ingredients.split(",").map((s) => s.trim());
  }

  if (body.tags) {
    data.tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags.split(",").map((s) => s.trim());
  }

  if (body.nutrition) {
    let raw = body.nutrition;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        // malformed nutrition JSON — skip it
        return data;
      }
    }
    data.nutrition = {
      calories: raw.calories != null ? Number(raw.calories) : undefined,
      protein:  raw.protein  != null ? Number(raw.protein)  : undefined,
      carbs:    raw.carbs    != null ? Number(raw.carbs)    : undefined,
      fat:      raw.fat      != null ? Number(raw.fat)      : undefined,
      fiber:    raw.fiber    != null ? Number(raw.fiber)    : undefined,
    };
  }

  return data;
};

// @desc    Get all products (optional filters + pagination)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      isVeg,
      isAvailable,
      isFeatured,
      isBestSeller,
      type,
      search,
      minPrice,
      maxPrice,
      page  = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    // Always hide soft-deleted products unless explicitly requested
    // (e.g. admin panel passes isAvailable=false to see disabled items)
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    if (category)    filter.category    = category;
    if (type)        filter.type        = type;

    if (isVeg !== undefined)
      filter.isVeg = isVeg === "true";

    if (isFeatured !== undefined)
      filter.isFeatured = isFeatured === "true";

    if (isBestSeller !== undefined)
      filter.isBestSeller = isBestSeller === "true";

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Cap limit to prevent full-collection dumps
    const safeLimit = Math.min(Number(limit), 50);
    const skip      = (Number(page) - 1) * safeLimit;

    const [products, total] = await Promise.all([
      Product.find(filter)
      .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count:   products.length,
      total,
      page:    Number(page),
      pages:   Math.ceil(total / safeLimit),
      data:    products,
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
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("comboItems.product", "name price images isAvailable isVeg");

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
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  console.log("REQ BODY:", req.body);
console.log("REQ FILE:", req.file);
console.log("REQ FILES:", req.files);
  try {
    console.log("createProduct — building product data");

    const productData = parseProductFields(req.body);

    const images = resolveImages(req);
    if (images) productData.images = images;

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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    console.log("updateProduct — id:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const updates = parseProductFields(req.body);

    // Apply only defined fields — no risk of wiping existing values
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) product[key] = value;
    });

    // Handle image replacement
    const newImages = resolveImages(req);
    if (newImages) {
      // Delete old images from Cloudinary
      if (product.images?.length) {
        await Promise.allSettled(
          product.images.map((url) => deleteCloudinaryImage(url))
        );
      }
      product.images = newImages;
    }

    const updatedProduct = await product.save();

    console.log("Product updated:", updatedProduct._id);

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    handleMongooseError(error, res);
    next(error);
  }
};

// @desc    Delete a product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    console.log("deleteProduct — id:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Delete all images from Cloudinary
    if (product.images?.length) {
      await Promise.allSettled(
        product.images.map((url) => deleteCloudinaryImage(url))
      );
    }

    product.isAvailable = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product disabled (soft deleted)",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product availability
// @route   PATCH /api/products/:id/toggle-availability
// @access  Private/Admin
export const toggleProductAvailability = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now ${product.isAvailable ? "available" : "unavailable"}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured flag
// @route   PATCH /api/products/:id/toggle-featured
// @access  Private/Admin
export const toggleFeaturedProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now ${product.isFeatured ? "featured" : "not featured"}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle best seller flag
// @route   PATCH /api/products/:id/toggle-bestseller
// @access  Private/Admin
export const toggleBestSeller = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isBestSeller = !product.isBestSeller;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now ${product.isBestSeller ? "best seller" : "normal"}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};