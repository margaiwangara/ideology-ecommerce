const express = require("express");

// router
const router = express.Router({ mergeParams: true });

const { registerUser } = require("../controllers/auth");

router.route("/register").post(registerUser);

module.exports = router;
