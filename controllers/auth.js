const ErrorResponse = require("../utils/ErrorResponse");
const db = require("../models");

exports.registerUser = async (req, res, next) => {
  try {
    // destructure required fields
    const { name, email, password, role } = req.body;

    // create new user
    const user = await db.User.create({
      name,
      email,
      password,
      role,
      ...req.body
    });

    // acquired token
    const token = user.generateJSONWebToken();

    return res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    // destructure required fields
    const { email, password } = req.body;

    // check if exists
    if (!email && !password) {
      let message = "Email and password fields required";
      return next(new ErrorResponse(message, 400));
    }

    // check if user exists
    const user = await db.User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // check if passwords match
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      message = "Invalid credentials";
      return next(new ErrorResponse(message, 401));
    }

    const token = user.generateJSONWebToken();

    return res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};
