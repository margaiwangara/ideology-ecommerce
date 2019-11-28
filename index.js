const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Security Packages
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// load env vars
dotenv.config({ path: "./config/config.env" });

// invoke express
const app = express();

// invoke middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// security middleware
// rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(mongoSanitize()); //sanitize input to prevent NoSQL Injection
app.use(helmet()); //helmet to add headers and prevent security flaws
app.use(xssClean()); //prevent xss attacks eg <script></script> tags in db
app.use(limiter); //no of request rate limited
app.use(hpp()); //prevent http param polution
app.use(cors()); //enabled cors for all routes

// static files
app.use(express.static(path.join(__dirname, "public")));

// api routes
// api route files
// app.use("/api/categories", categoryRoutes);
// const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/users", userRoutes);

// sample route
const db = require("./models");
app.get("/test", async function(req, res, next) {
  try {
    let query;
    // filter
    if (req.query.filter) {
      const filter = req.query.filter;

      //  replace
      const step1 = filter
        .replace(/(color:|size:|price:)/gi, value => `${value}{$in: [`)
        .replace(/;/g, "]};");

      query = db.Product.find(JSON.parse(step1));
    }

    const data = await query;

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});
// Error Handler
app.use(function(req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});
const errorHandler = require("./handlers/error");
app.use(errorHandler);

// set PORT and run app
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `App running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )
);
