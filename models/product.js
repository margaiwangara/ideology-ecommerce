const mongoose = require("mongoose");
const slugify = require("slugify");

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
      maxlength: [255, "Maximum file name length[255] exceeded"]
    },
    rating: {
      type: Number,
      max: [5, "Maximum star rating[5] exceeded"]
    },
    category: {
      type: String,
      required: [true, "Category field is required"]
    },
    attributes: []
  },
  {
    timestamps: true
  }
);

// Middleware
productSchema.pre("save", function(next) {
  let title = this.title;
  title = title.replace(/[;\/:*?""<>|&.,']/g, "");

  this.slug = slugify(title, { lower: true });
  next();
});

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
