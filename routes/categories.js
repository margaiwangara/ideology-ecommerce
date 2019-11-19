const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getCategories,
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory
} = require("../controllers/categories");

// advanced results middleware
const Category = require("../models/category");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Category, { path: "products", select: "name description" }),
    getCategories
  )
  .post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
