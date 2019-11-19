const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqid = require("uniquid");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Name field is unique"],
      maxlength: 255,
      trim: true,
      required: [true, "Name field is required"]
    },
    sku: {
      type: String,
      required: [true, "SKU field is required"],
      unique: [true, "SKU field is unique"]
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
    mainImage: {
      type: String,
      default: "no-image.jpg",
      maxlength: [255, "Maximum name length[255] exceeded"]
    },
    averageRating: {
      type: Number,
      max: [5, "Maximum star rating[5] exceeded"]
    },
    attributes: [
      {
        color: {
          type: String,
          required: [true, "Color field is required"]
        },
        size: {
          short: {
            type: String,
            required: [true, "Size.short field is required"]
          },
          long: {
            type: String,
            required: [true, "Size.long field is required"]
          }
        },
        quantity: {
          type: Number,
          min: [0, "Minimum quantity size is 0"],
          required: [true, "Quantity field is required"]
        }
      }
    ],
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Categories",
        required: [true, "Category id required"]
      }
    ]
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
