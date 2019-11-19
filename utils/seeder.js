const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

// dotenv file loc
dotenv.config({ path: `${__dirname}/../config/config.env` });

// enable promises for mongoose
mongoose.Promise = Promise;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true
  })
  .then(conn => console.log(`MongoDB Connected: ${conn.connection.host}`))
  .catch(error => console.log(error));

// Collections
const Products = require("../models/product");
const Categories = require("../models/category");

const seedProductsCollection = async () => {
  try {
    const data = fs.readFileSync(`${__dirname}/../_data/products.json`, {
      encoding: "utf-8"
    });
    await Categories.create();
    await Products.create(JSON.parse(data));

    console.log("Products collection seeded successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteProductsFromCollection = async () => {
  try {
    await Products.deleteMany();
    await Categories.deleteMany();
    console.log("All records deleted successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === "-c") {
  seedProductsCollection();
} else if (process.argv[2] === "-d") {
  deleteProductsFromCollection();
}
