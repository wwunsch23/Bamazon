DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255),
  department_name VARCHAR(255),
  price DECIMAL(6, 2),
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot","Electronics",49.99,1050),
    ("Fire stick","Electronics",39.99,2000),
    ("Mr. Coffee Cafe Barista Espresso and Cappuccino Maker","Home & Kitchen",99.99,250),
    ("Greenies Canine Pill Pockets", "Pet Supplies",4.36,500),
    ("The Essential Johnny Cash", "CDs & Vinyl",22.99,800),
    ("Chronicle: The 20 Greatest Hits", "CDs & Vinyl",20.63,625),
    ("Instant Pot LUX Mini", "Home & Kitchen",59.95,730),
    ("Chuckit! Ultra Ball","Pet Supplies",7.80,436),
    ("Vans Authentic Low-Top Sneakers","Men's Shoes",74.95,25),
    ("Air Jordan 13 Retro","Men's Shoes",171.15,25);
