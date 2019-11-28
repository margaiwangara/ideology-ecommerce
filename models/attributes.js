const mongoose = require("mongoose");

const attributesSchema = new mongoose.Schema({
  color: String,
  size: String,
  quantity: {
    type: Number,
    required: [true, "Quantity field is required"]
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Products",
    required: [true, "Product field is required"]
  }
});

const Attribute = mongoose.model("Attributes", attributesSchema);

module.exports = Attribute;
