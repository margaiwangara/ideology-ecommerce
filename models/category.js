const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// reverse populate with virtuals
categorySchema.virtual("products", {
  ref: "Products",
  localField: "_id",
  foreignField: "categories",
  justOne: false
});

const Category = new mongoose.model("Categories", categorySchema);

module.exports = Category;
