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
const { userAuthorized, roleAuthorized } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Category, { path: "products", select: "name description" }),
    getCategories
  )
  .post(userAuthorized, roleAuthorized("admin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(userAuthorized, roleAuthorized("admin"), updateCategory)
  .delete(userAuthorized, roleAuthorized("user"), deleteCategory);

module.exports = router;
