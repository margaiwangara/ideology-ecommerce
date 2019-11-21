const ErrorResponse = require("../utils/ErrorResponse");
const db = require("../models");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
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

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
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

/**
 * @desc    Get currently logged in user
 * @route   GET /api/auth/account
 * @access  Private
 */
exports.getCurrentLoggedInUser = async (req, res, next) => {
  try {
    const user = await db.User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(new ErrorResponse("Unauthorized Access", 401));
  }
};

/**
 * @desc    Reset Password Step 1
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    // get user by email
    const { email } = req.body;
    const user = await db.User.findOne({ email });

    if (user == null) {
      return next(
        new ErrorResponse("User with that email does not exist", 404)
      );
    }

    // get reset token
    const resetToken = user.generateResetPasswordToken();

    // save token to db
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Please check your email to reset password"
    });
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
