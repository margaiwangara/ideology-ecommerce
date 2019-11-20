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
const { userAuthorized } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Product, "categories"), getProducts)
  .post(userAuthorized, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(userAuthorized, updateProduct)
  .delete(userAuthorized, deleteProduct);

router.route("/:id/image").put(userAuthorized, uploadProductImage);

module.exports = router;
