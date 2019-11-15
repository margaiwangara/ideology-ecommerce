const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqid = require("uniquid");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      maxlength: 255,
      trim: true,
      required: true
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    slug: String,
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      maxlength: 500,
      required: true,
      trim: true
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
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
