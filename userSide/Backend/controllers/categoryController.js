import Category from "../models/categoryModel.js";

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getSingleCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400);
      error.message = "Invalid category ID";
    }
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, displayOrder } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    // Auto-generate slug from name
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const category = await Category.create({
      name: name.trim(),
      slug,
      displayOrder: displayOrder ?? 0,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      error.message = "Category with this name already exists";
    }
    if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, displayOrder } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      res.status(404);
      throw new Error("Category not found");
    }

    if (name !== undefined) {
      category.name = name.trim();
      category.slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    }

    if (displayOrder !== undefined) {
      category.displayOrder = Number(displayOrder);
    }

    const updated = await category.save();

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      error.message = "Category with this name already exists";
    }
    if (error.name === "CastError") {
      res.status(400);
      error.message = "Invalid category ID";
    }
    next(error);
  }
};

// @desc    Delete a category (soft delete)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      res.status(404);
      throw new Error("Category not found");
    }

    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400);
      error.message = "Invalid category ID";
    }
    next(error);
  }
};