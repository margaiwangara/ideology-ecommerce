const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc    Get All Categories
 * @route   GET /api/categories
 * @route   GET /api/products/:productId/categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    let query;
    if (req.params.productId) {
      query = db.Category.find({ products: req.params.productId });
    } else {
      query = db.Category.find({}).populate({
        path: "products",
        select: "name description"
      });
    }

    const categories = await query;

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Category
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategory = async (req, res, next) => {
  try {
    const category = await db.Category.findById(req.params.id);
    // if Category exists
    if (category === null) {
      return next(new ErrorResponse(`Resource Not Found`, 404));
    }

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create New Category
 * @route   POST /api/categories
 * @access  Private
 */
exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await db.Category.create(req.body);

    return res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await db.Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    return res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    await db.Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};
