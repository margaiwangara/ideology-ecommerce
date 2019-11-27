const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const db = require("../models");
const sql = require("../handlers/sql");
const sqlConnection = require("../models").sqlConnection;

/**
 * @desc    Get All Products
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const products = await sql.find("products", sqlConnection);

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
    const product = await sql.findById(
      req.params.id,
      "products",
      sqlConnection
    );
    // if product exists
    if (product.length === 0) {
      next(new ErrorResponse("Resource Not Found", 404));
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
    const newProduct = await sql.create(req.body, "products", sqlConnection);

    return res.status(201).json({
      success: true,
      data: { ...req.body, id: newProduct.insertId }
    });
  } catch (error) {
    console.log(error);
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

/**
 * @desc    Upload Product Image
 * @route   /api/products/:id/image
 * @access  Private
 */
exports.uploadProductImage = async (req, res, next) => {
  try {
    const product = await db.Product.findOne({ _id: req.params.id });

    if (!product) {
      return next(new ErrorResponse(`Resource Not Found`, 404));
    }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    // deconstruct file from files
    const file = req.files.file;

    // File Validation
    // is file and image
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // file maximum size
    if (file.size > process.env.FILE_MAX_SIZE) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${Math.floor(
            process.env.FILE_MAX_SIZE / 1000000
          )}MB`,
          400
        )
      );
    }

    // move file
    file.name = `product_${product._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      try {
        if (err) {
          console.log(err);
          return next(new ErrorResponse(`File failed to upload`, 500));
        }

        await db.Product.findByIdAndUpdate(product.id, {
          mainImage: file.name
        });
      } catch (error) {
        return next(error);
      }
    });

    return res.status(200).json({
      success: true,
      message: `File ${file.name} was uploaded successfully`
    });
  } catch (error) {
    next(error);
  }
};
