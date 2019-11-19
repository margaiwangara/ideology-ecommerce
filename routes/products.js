const express = require("express");
const router = express.Router({ mergeParams: true });

// get controller methods
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require("../controllers/products");

// middleware files
const Product = require("../models/product");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(advancedResults(Product, "categories"), getProducts)
  .post(createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/:id/image").put(uploadProductImage);

module.exports = router;
