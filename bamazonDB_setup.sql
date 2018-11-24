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
VALUES ("Echo Dot","Electronics",49.99,50),
    ("Fire stick","Electronics",39.99,30),
    ("Mr. Coffee Cafe Barista Espresso and Cappuccino Maker","Home & Kitchen",99.99,25),
    ("Greenies Canine Pill Pockets", "Pet Supplies",4.36,3),
    ("The Essential Johnny Cash", "CDs & Vinyl",22.99,8),
    ("Chronicle: The 20 Greatest Hits", "CDs & Vinyl",20.63,25),
    ("Instant Pot LUX Mini", "Home & Kitchen",59.95,30),
    ("Chuckit! Ultra Ball","Pet Supplies",7.80,43),
    ("Vans Authentic Low-Top Sneakers","Men's Shoes",74.95,12),
    ("Air Jordan 13 Retro","Men's Shoes",171.15,2);
