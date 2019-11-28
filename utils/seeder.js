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
const Users = require("../models/users");

const seedCollection = async () => {
  try {
    // file routes
    let productFile = `${__dirname}/../_data/products.json`,
      categoryFile = `${__dirname}/../_data/categories.json`,
      userFile = `${__dirname}/../_data/users.json`;

    //  data acquisition
    const productData = fs.readFileSync(productFile, "utf-8");
    const categoryData = fs.readFileSync(categoryFile, "utf-8");
    const userData = fs.readFileSync(userFile, "utf-8");

    // Database input
    await Users.create(JSON.parse(userData));
    await Categories.create(JSON.parse(categoryData));
    await Products.create(JSON.parse(productData));

    console.log("Resource seeded successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteFromCollection = async () => {
  try {
    //deletion from database
    await Products.deleteMany();
    await Categories.deleteMany();
    await Users.deleteMany();

    console.log("All records deleted successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === "-c") {
  seedCollection();
} else if (process.argv[2] === "-d") {
  deleteFromCollection();
}
