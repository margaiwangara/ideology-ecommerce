const mysql = require("mysql");

// Find All
function find(table, connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} ORDER BY id ASC`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

// Find By Id
function findById(id, table, connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} WHERE id=${id}`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
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
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

module.exports.findById = findById;
module.exports.find = find;
module.exports.create = create;
