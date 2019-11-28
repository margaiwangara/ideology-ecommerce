const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
      required: [true, "Product field is required"]
    },
    attributes: [],
    totalQuantity: Number
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
