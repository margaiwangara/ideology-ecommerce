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

    // make copy of req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "filter", "sort", "page", "limit"];

    // loop over remove fields and delete from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

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

    // check if select exists and select input fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // products sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // product filtering
    if (req.query.filter) {
      // initial split color:red,green;size:s,xs;
      const firstSplit = req.query.filter.split(";");
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await db.Product.countDocuments();

    // pagination query
    query = query.skip(startIndex).limit(limit);

    // get all products
    const products = await query.populate({
      path: "categories",
      select: "name"
    });

    // pagination
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      pagination
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
