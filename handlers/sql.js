const mysql = require("mysql");

// Find All
function find(table, connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} ORDER BY id ASC`,
      promiseHandler(resolve, reject)
    );
  });
}

// Find By Id
function findById(id, table, connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} WHERE id=${id}`,
      promiseHandler(resolve, reject)
    );
  });
}

// create new item
function create(data, table, connection) {
  return new Promise((resolve, reject) => {
    let keys = Object.keys(data).join(",");
    let values = JSON.stringify(Object.values(data)).replace(/\[|\]/g, "");
    connection.query(
      `INSERT INTO ${table} (${keys}) VALUES (${values})`,
      promiseHandler(resolve, reject)
    );
  });
}

// update existing item
function findByIdAndUpdate(id, data, table, connection) {
  return new Promise((resolve, reject) => {
    // stringify input
    let split1 = JSON.stringify(data)
      .split(":")
      .join("=")
      .replace(/{|}/g, "");
    // remove quotes from part of the string
    let split2 = split1.replace(
      /("name"|"description"|"price"|"poster")/g,
      value => value.slice(1, -1)
    );
    console.log(`Final: ${split2}`);
    connection.query(
      `UPDATE ${table} SET ${split2} WHERE id=${id}`,
      promiseHandler(resolve, reject)
    );
  });
}

// promise handler
const promiseHandler = (resolve, reject) => (error, results) => {
  if (error) reject(error);
  resolve(results);
};

module.exports.findById = findById;
module.exports.find = find;
module.exports.create = create;
module.exports.findByIdAndUpdate = findByIdAndUpdate;
