const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      maxlength: [100, "Maximum name length is 100 characters"]
    },
    surname: {
      type: String,
      maxlength: [100, "Maximum surname length is 100 characters"]
    },
    email: {
      type: String,
      unique: true,
      maxlength: [100, "Maximum email length is 100 characters"],
      required: [true, "Email field is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email"
      ]
    },
    password: {
      type: String,
      minlength: [6, "Minimum password length is 6 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        "Please enter a valid password, at least one lowercase and uppercase letter and one number"
      ],
      select: false,
      required: [true, "Password field is required"]
    },
    address: [
      {
        type: String
      }
    ],
    role: {
      type: String,
      enum: ["user", "publisher", "admin"],
      default: "user",
      required: [true, "User role is required"]
    },
    resetPasswordToken: String,
    resetPasswordExpire: String
  },
  {
    timestamps: true
  }
);

// password hash middleware
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = mongoose.model("Users", userSchema);

module.exports = User;
