const sql = require("../handlers/sql");
const sqlConnection = require("../models").sqlConnection;

/**
 * @desc    Get All Product Attributes / Attributes belonging to certain product
 * @route   GET /api/attributes
 *          GET /api/products/:productId/attributes
 * @access  Public
 */
exports.getAttributes = async (req, res, next) => {
  try {
    let query;
    // check if product id exists
    if (req.params.productId) {
      query = sql;
    }
    query = sql.find("attributes", sqlConnection);

    attributes = await query;

    return res.status(200).json({
      success: true,
      data: attributes
    });
  } catch (error) {
    next(error);
  }
};
