DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(6,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("XBox One", "Electronics", 399.99, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Fender Stratocastor", "Musical Instruments", 1999.95, 80);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Desk Lamp", "Housewares", 29.95, 10000);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Playstation 4", "Electronics", 499.99, 321);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Guitar Tuner", "Musical Instruments", 29.91, 1415);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Backpack", "Bags and Accessories", 79.50, 741);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("New England Patriot Baseball Cap", "Clothing and Accessories", 45.00, 56);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Tom Brady Jersey", "Clothing and Accessories", 99.99, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Gargoyle", "Home Decorations", 39.99, 300);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Giant Gummy Bear", "Food", 29.99, 500);

ALTER TABLE products ADD product_sales DECIMAL(6,2) DEFAULT 0;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs DECIMAL(6,2) DEFAULT 0,
    PRIMARY KEY (department_id)
);


