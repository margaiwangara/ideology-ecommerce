const ErrorResponse = require("../utils/ErrorResponse");
const db = require("../models");

exports.registerUser = async (req, res, next) => {
  try {
    const newUser = await db.User.create(req.body);

    return res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};
