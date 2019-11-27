const productsTable = `CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
  name VARCHAR(255) NOT NULL UNIQUE, 
  description TEXT NOT NULL,
  slug VARCHAR(255),
  poster VARCHAR(255) DEFAULT 'no-image.jpg',
  price DECIMAL(8, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

const attributesTable = `CREATE TABLE IF NOT EXISTS attributes (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  code VARCHAR(20) NOT NULL,
  value VARCHAR(50) NOT NULL
)`;

const productAttributesTable = `CREATE TABLE IF NOT EXISTS product_attributes (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  product_id INT NOT NULL,
  color_id INT,
  size_id INT,
  quantity INT NOT NULL DEFAULT 0,
  CONSTRAINT FK_ProductID FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT FK_ProductColor FOREIGN KEY (color_id) REFERENCES attributes(id),
  CONSTRAINT FK_ProductSize FOREIGN KEY (size_id) REFERENCES attributes(id)
)`;

module.exports = {
  productsTable,
  attributesTable,
  productAttributesTable
};
