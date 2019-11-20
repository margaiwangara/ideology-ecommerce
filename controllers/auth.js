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

    // token response method
    getTokenResponse(user, 201, res);
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

    // token response method
    getTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get JWT and store in cookie
const getTokenResponse = (user, statusCode, res) => {
  // token
  const token = user.generateJSONWebToken();

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // secure in production env
  if (process.env.NODE_ENV == "production") {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
