// Find All
function find(table, connection) {
  const query = `SELECT * FROM ${table} ORDER BY id ASC`;

  return promiseHandler(query, connection);
}

// Find By Id
function findById(id, table, connection) {
  const query = `SELECT * FROM ${table} WHERE id=${id}`;
  return promiseHandler(query, connection);
}

// create new item
function create(data, table, connection) {
  let keys = Object.keys(data).join(",");
  let values = JSON.stringify(Object.values(data)).replace(/\[|\]/g, "");

  const query = `INSERT INTO ${table} (${keys}) VALUES (${values})`;

  return promiseHandler(query, connection);
}

// update existing item
function findByIdAndUpdate(id, data, table, connection) {
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
  const query = `UPDATE ${table} SET ${split2} WHERE id=${id}`;
  return promiseHandler(query, connection);
}

// delete item by id
function findByIdAndDelete(id, table, connection) {
  const query = `DELETE FROM ${table} WHERE id=${id}`;
  return promiseHandler(query, connection);
}

// joins

// promise handler
const promiseHandler = (query, connection) =>
  new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });

module.exports.find = find;
module.exports.findById = findById;
module.exports.create = create;
module.exports.findByIdAndUpdate = findByIdAndUpdate;
module.exports.findByIdAndDelete = findByIdAndDelete;
