const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getCategories,
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory
} = require("../controllers/categories");

// middleware
const Category = require("../models/category");
const advancedResults = require("../middleware/advancedResults");
const { userAuthorized } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Category, { path: "products", select: "name description" }),
    getCategories
  )
  .post(userAuthorized, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(userAuthorized, updateCategory)
  .delete(userAuthorized, deleteCategory);

module.exports = router;
