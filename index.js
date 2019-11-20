const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// load env vars
dotenv.config({ path: "./config/config.env" });

// invoke express
const app = express();

// api route files
const fooRoutes = require("./routes/foo");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");

// invoke middlewares
app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, "public")));

// api routes
app.use("/api/foo", fooRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

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
