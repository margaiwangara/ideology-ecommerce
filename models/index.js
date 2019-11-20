const mongoose = require("mongoose");

// set debug to true to display db responses
mongoose.set("debug", true);
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

module.exports.Foo = require("./foo"); // test collection
module.exports.Product = require("./product");
module.exports.Category = require("./category");
module.exports.User = require("./users");
