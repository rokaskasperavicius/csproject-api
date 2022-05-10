export const PSQL_CODES = {
  DEFAULT: 1,
  PRODUCT_UNIQUE: 2,
}

export const RESET_SQL_QUERY = `
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS subcategories;

  CREATE TABLE subcategories (
      name VARCHAR(99) PRIMARY KEY,
      category_name VARCHAR(99) NOT NULL
  );

  CREATE TABLE products (
      name VARCHAR(99) NOT NULL,
      subcategory_name VARCHAR(99) NOT NULL REFERENCES subcategories(name) ON DELETE RESTRICT ON UPDATE RESTRICT,
      note VARCHAR(99),
      expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
      notified boolean NOT NULL DEFAULT false,
      PRIMARY KEY(name, expiry_date)
  );

  INSERT INTO subcategories(name, category_name) VALUES ('Makeup', 'Cosmetics');
  INSERT INTO subcategories(name, category_name) VALUES ('Other Cosmetics', 'Cosmetics');
  INSERT INTO subcategories(name, category_name) VALUES ('Baby Food', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Baking', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Beer, Wine & Spirits', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Beverages', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Bread & Bakery', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Cereals', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Condiments & Spices', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Dairy, Eggs & Cheese', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Fish & Shellfish', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Fruits', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Grains, Pasta & Sides', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Meat', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Other Food', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Pet Food', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Sauces & Oils', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Snacks & Candy', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Vegetables', 'Food');
  INSERT INTO subcategories(name, category_name) VALUES ('Node Medicine', 'Medicine');
  INSERT INTO subcategories(name, category_name) VALUES ('Other Medicine', 'Medicine');

  INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Carrots', 'Vegetables', 'These carrots are really fresh', '2023-05-20T00:00:00.000Z');
  INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Raw apples', 'Vegetables', NULL, '2023-05-20T00:00:00.000Z');
  INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Chicken', 'Meat', 'Should be eaten fast', '2022-09-05T00:00:00.000Z');
  INSERT INTO products (name, subcategory_name, note, expiry_date) VALUES('Milk', 'Dairy, Eggs & Cheese', 'Good mælk', '2022-08-30T00:00:00.000Z');
`
