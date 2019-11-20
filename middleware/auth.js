const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/users");

exports.userAuthorized = async (req, res, next) => {
  try {
    let token, header;
    header = req.headers.authorization;

    // check if token exists and starts with Bearer
    if (header && header.startsWith("Bearer")) token = header.split(" ")[1];
    // else if (req.cookies.token) token = req.cookies.token;

    // check token variable
    if (!token) return next(new ErrorResponse("Unauthorized Access", 401));

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user by id from decoded
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized Access", 401));
  }
};

// login required
exports.loginRequired = async (req, res, next) => {
  try {
    let token, header;
    header = req.headers.authorization;

    // check if token exists and starts with Bearer
    if (header && header.startsWith("Bearer")) token = header.split(" ")[1];
    // else if (req.cookies.token) token = req.cookies.token;

    if (!token) {
      return next(
        new ErrorResponse("Please log in to access this service", 401)
      );
    }

    // verify token
    await jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    next(new ErrorResponse("Please log in to access this service", 401));
  }
};

// role based authorization
exports.roleAuthorized = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
