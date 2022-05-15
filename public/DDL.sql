--Drop all tables
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS subcategories;

--Create all tables
CREATE TABLE subcategories (
    name VARCHAR(99) PRIMARY KEY,
    category_name VARCHAR(99) NOT NULL
);

CREATE TABLE products (
    name VARCHAR(99) NOT NULL,
    subcategory_name VARCHAR(99) NOT NULL REFERENCES subcategories(name) ON DELETE RESTRICT ON UPDATE RESTRICT,
    note VARCHAR(999),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notified boolean NOT NULL DEFAULT false,
    PRIMARY KEY(name, expiry_date)
);

--Insert default values
INSERT INTO subcategories(name, category_name) VALUES ('Bodycare', 'Cosmetics');
INSERT INTO subcategories(name, category_name) VALUES ('Facecare', 'Cosmetics');
INSERT INTO subcategories(name, category_name) VALUES ('Haircare', 'Cosmetics');
INSERT INTO subcategories(name, category_name) VALUES ('Makeup', 'Cosmetics');
INSERT INTO subcategories(name, category_name) VALUES ('Other Cosmetics', 'Cosmetics');

INSERT INTO subcategories(name, category_name) VALUES ('Baby Food', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Baking', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Beer, Wine & Spirits', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Beverages', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Bread & Bakery', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Canned Goods', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Cereals', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Condiments & Spices', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Dairy, Eggs & Cheese', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Fish & Shellfish', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Frozen', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Fruits', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Grains, Pasta & Sides', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Meat', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Other Food', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Pet Food', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Sauces & Oils', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Snacks & Candy', 'Food');
INSERT INTO subcategories(name, category_name) VALUES ('Vegetables', 'Food');

INSERT INTO subcategories(name, category_name) VALUES ('Food Supplements', 'Medicine');
INSERT INTO subcategories(name, category_name) VALUES ('Prescription medicine', 'Medicine');
INSERT INTO subcategories(name, category_name) VALUES ('Over The Counter Drugs', 'Medicine');
INSERT INTO subcategories(name, category_name) VALUES ('Other Medicine', 'Medicine');

INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Carrots', 'Vegetables', 'These carrots are really fresh', '2023-05-20T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Raw apples', 'Vegetables', NULL, '2023-05-20T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Chicken', 'Meat', 'Should be eaten fast', '2022-09-05T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Milk', 'Dairy, Eggs & Cheese', 'Good mælk', '2022-08-30T00:00:00.000Z');

INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Lipstick', 'Makeup', 'the red one', '2022-06-08T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Shower gel', 'Bodycare', 'Good gel - blue bottle', '2022-06-08T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Mascara', 'Makeup', 'gifted', '2022-06-09T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Conditioner', 'Haircare', 'Loreal brand', '2022-06-10T00:00:00.000Z');

INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Painkillers', 'Over The Counter Drugs', 'Paracetamol', '2022-06-10T00:00:00.000Z');
INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Vitamin D', 'Food Supplements', 'the small bottle', '2022-06-10T00:00:00.000Z');