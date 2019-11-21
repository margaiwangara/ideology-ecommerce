const express = require("express");

// router
const router = express.Router({ mergeParams: true });

// middleware
const { userAuthorized } = require("../middleware/auth");

// auth methods
const {
  registerUser,
  loginUser,
  getCurrentLoggedInUser,
  forgotPassword,
  resetPassword
} = require("../controllers/auth");

// currently logged in user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/account", userAuthorized, getCurrentLoggedInUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);

module.exports = router;
