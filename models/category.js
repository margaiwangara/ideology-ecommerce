const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Category = new mongoose.model("Categories", categorySchema);

module.exports = Category;
