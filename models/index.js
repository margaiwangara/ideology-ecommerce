const mongoose = require("mongoose");
const mysql = require("mysql");
const colors = require("colors");

// get sql queries
const {
  productsTable,
  attributesTable,
  productAttributesTable
} = require("../utils/sqlQueries");

/**
 * MongoDB Connection
 */
mongoose.set("debug", true);
mongoose.Promise = Promise;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true
  })
  .then(conn =>
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold)
  )
  .catch(error => console.log(error));

/**
 * MySQL Connection
 */
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

connection.connect(err => {
  if (err) {
    console.log(err.red.bold);
    return;
  }
  console.log(`Connection to MySQL DB Successfull`.cyan.bold);
});

// SQL Create Tables
connection.query(productsTable, (error, results) => {
  if (error) {
    console.log(error.sqlMessage);
    return;
  }
  console.log("Products table created".green.inverse);
});

module.exports.Product = require("./product");
module.exports.Category = require("./category");
module.exports.User = require("./users");
module.exports.sqlConnection = connection;
