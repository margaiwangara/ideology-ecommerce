const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqid = require("uniquid");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "Title field is unique"],
      maxlength: 255,
      trim: true,
      required: [true, "Title field is required"]
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "Price field is required"]
    },
    description: {
      type: String,
      maxlength: 500,
      required: [true, "Description field is required"],
      trim: true
    },
    thumbnail: {
      type: String,
      default: "no-image.jpg",
      maxlength: [255, "Maximum name length[25  5] exceeded"]
    },
    rating: {
      type: Number,
      max: [5, "Maximum star rating[5] exceeded"]
    },
    department: {
      type: String,
      required: [true, "Department field is required"]
    },
    category: {
      type: String,
      required: [true, "Category field is required"]
    }
  },
  {
    timestamps: true
  }
);

// Middlewares
productSchema.pre("validate", function(next) {
  this.sku = uniqid();
  next();
});

productSchema.pre("save", function(next) {
  let name = this.name;
  name = name.replace(/[;\/:*?""<>|&.,']/g, "");

  this.slug = slugify(name, { lower: true });
  next();
});

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
