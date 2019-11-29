const db = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc  Get All Items from cart
 * @route GET /api/cart
 * @access Public / Private
 */
exports.getItemsFromCart = async (req, res, next) => {
  try {
    return res.status(200).json(res.advancedResults);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get Single Item from cart
 * @route GET /api/cart/:id
 * @access Public / Private
 */
exports.getItemFromCart = async (req, res, next) => {
  try {
    const cart = await db.Cart.findById(req.params.id).populate({
      path: "product",
      select: "title description price"
    });

    // check if item exists
    if (!cart) {
      return next(new ErrorResponse("Resource Not Found", 404));
    }

    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add Item To Cart
 * @route  POST /api/cart
 * @access Public / Private
 */
exports.addItemToCart = async (req, res, next) => {
  try {
    // get product id
    if (!req.body.productId)
      return next(new ErrorResponse("Product Id field is required", 400));

    console.log(req.body);
    // get product
    const product = await db.Product.findById(req.body.productId);

    if (!product) return next(new ErrorResponse("Resource Not Found", 404));

    //  check headers
    let headers, token;
    headers = req.headers.authorization;

    if (headers && headers.startsWith("Bearer")) token = headers.split(" ")[1];
    else if (req.cookies.token) token = req.cookies.token;

    // if token doesn't exist , not logged in save data in cookie
    // const cartItem = cart.addToCart(product, product._id);
    // if (!token)
    //   res.cookie("cart", cartItem, {
    //     expires: Date.now() * 7 * 24 * 60 * 60 * 1000
    //   });

    // if token exists add to model
    // console.log(req.cookies);

    return res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @desc  Get All Items from cart
 * @route GET /api/cart
 * @access Public / Private
 */

/**
 * @desc  Get All Items from cart
 * @route GET /api/cart
 * @access Public / Private
 */

// Add Items to Cart
function manageCart(oldCart) {
  this.items = oldCart.items;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = oldCart.totalPrice;

  this.addToCart = function(item, id) {
    let storedItem = items[id];

    if (!storedItem) {
      storedItem = this.items[id] = {
        item,
        qty: 0,
        price: 0
      };
    }

    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.price;
  };

  this.generateArray = function() {
    const arr = [];

    for (let i in this.items) {
      arr.push(this.items[i]);
    }

    return arr;
  };
}
