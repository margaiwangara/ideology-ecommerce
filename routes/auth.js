const express = require("express");

// router
const router = express.Router({ mergeParams: true });

const { registerUser, loginUser } = require("../controllers/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
