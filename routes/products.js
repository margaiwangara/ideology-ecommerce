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

router
  .route("/")
  .get(getProducts)
  .post(createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/:id/image").put(uploadProductImage);

module.exports = router;
