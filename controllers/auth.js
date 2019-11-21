const crypto = require("crypto");
const ErrorResponse = require("../utils/ErrorResponse");
const db = require("../models");
const sendEmail = require("../utils/sendEmail");

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
 * @desc    Forgot Password
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

    // send email with token
    const URL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetpassword?token=${resetToken}`;
    const options = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Password Reset Token",
      html: `
      <style>
      *{
        margin: 0;
        padding: 0;
      }
      a{
        text-decoration: none;
        color: #a55f41;
      }
      a:hover{
        color: #e6b790;
      }
      .wrapper{
        width: 100%;
        height: 100vh;
        background: #eef0e9;
        font-family: 'calibri';
        font-size: 1rem;
        text-align: center;
      }
      .wrapper-header{
        width: 100%;
        background: #a55f41;
        font-size: 1.6rem;
        font-weight: bold;
        font-family: 'Montserrat';
        color: #eef0e9;
        padding: 0.65rem 0;
      }
      .inner-wrapper{
        width: 90%;
        height: 100%;
        margin: 0 auto;
        padding: 1.2rem 0;
        text-align: center;
        line-height: 1.7rem;
      
      }
      
      .holder{
        display: block;
        margin-top: 15px;
      }
      
      .btn{
        border: solid #a55f41 1px;
        border-radius: 10px;
        padding: 10px;
        font-size: 1.1rem;
        cursor: pointer;
      }
      
      .btn:hover{
        background: #a55f41;
        color: #eef0e9;
      }
      
      </style>
      <div class='wrapper'>
      <div class="wrapper-header">
        <p>Ideology</p>
      </div>
      <div class="inner-wrapper">
        <p>Please click on the link or button provided below to reset your password<br/><a href="${URL}" target="_blank">${URL}</a></p>
        <div class="holder">
          <a href="${URL}" target="_blank" class="btn">Reset Password</a>      
        </div>
      </div>
    </div>`
    };

    const emailResponse = await sendEmail(options);
    if (!emailResponse) {
      return next(new ErrorResponse("Email not sent", 500));
    }
    return res.status(200).json({
      success: true,
      message: "Please check your email to reset your password"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password
 * @route   POST /api/auth/resetpassword?token=:token
 * @access  Private
 */
exports.resetPassword = async (req, res, next) => {
  try {
    // get token
    const { token } = req.query;

    if (!token) {
      console.log("Token Failed 1");
      return next(new ErrorResponse("Invalid Token!", 400));
    }

    // get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // get user by token
    const user = await db.User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    // if user not found throw error
    if (user == null) {
      console.log("Token Failed 2");
      return next(new ErrorResponse("Invalid Token!", 400));
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // save
    await user.save({ validateBeforeSave: false });

    // generate JWT Token
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
