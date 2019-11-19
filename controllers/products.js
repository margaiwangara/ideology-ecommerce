const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc    Get All Products
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    let query;

    let queryStr = JSON.stringify(req.query);

    // price handling
    queryStr = queryStr.replace(
      /\b(gt|lt|gte|lte|in)\b/g,
      match => `$${match}`
    );
    // replace rating to average rating
    queryStr = queryStr.replace("rating", "averageRating");

    // handling filters
    //filter=color:red,green;size:s,xs; displays products that have red and green color and also s and xs size
    // run query
    query = db.Product.find(JSON.parse(queryStr));

    const products = await query.populate("categories");

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Product
 * @route   /api/products/:id
 * @access  Public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await db.Product.findById(req.params.id);
    // if product exists
    if (!product) {
      next(new ErrorResponse(`Resource Not Found`, 404));
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create New Product
 * @route   /api/products
 * @access  Private
 */
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await db.Product.create(req.body);

    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Product
 * @route   /api/products/:id
 * @access  Private
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await db.Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Product
 * @route   /api/products/:id
 * @access  Private
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    await db.Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};
