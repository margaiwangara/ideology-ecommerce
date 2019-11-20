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
const { userAuthorized, roleAuthorized } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Product, "categories"), getProducts)
  .post(userAuthorized, roleAuthorized("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(userAuthorized, roleAuthorized("admin"), updateProduct)
  .delete(userAuthorized, roleAuthorized("admin"), deleteProduct);

router
  .route("/:id/image")
  .put(userAuthorized, roleAuthorized("admin"), uploadProductImage);

module.exports = router;
