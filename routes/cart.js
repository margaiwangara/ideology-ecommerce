const express = require("express");

const router = express.Router();

const { addItemToCart } = require("../controllers/cart");

router.route("/").post(addItemToCart);

module.exports = router;
