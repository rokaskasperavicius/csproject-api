import express from 'express'

// Middlewares
import { schemaHandler } from 'utils/middlewares.js'

// Services
import db from 'services/db.js'

// Schemas
import {
  getProducts,
  postProducts,
  deleteProduct,
} from 'features/products/schema.js'

const app = express.Router()

app.get('/', schemaHandler(getProducts, 'query'), async (req, res, next) => {
  /**
   * filter - filter all products by subcategory names (default = all subcategories)
   * seatch - search all products based on product name, note, category name and subcategory name (default = no search)
   *
   * https://www.postgresql.org/docs/current/textsearch-intro.html
   */
  try {
    const { filter, search } = req.query

    const query = `
      SELECT P.name, P.note, P.expiry_date as "expiryDate", SC.category_name as "categoryName"
        FROM products P
        JOIN subcategories SC ON SC.name = P.subcategory_name
        WHERE
          ($1::text IS NULL OR P.subcategory_name = $1)
        AND
          ($2::text IS NULL OR CONCAT_WS(' ', P.name, P.note, SC.name, SC.category_name) @@ $2)
        ;
      `
    const values = [filter, search]

    const data = await db(query, values)
    res.json({
      success: true,
      data,
    })
  } catch (err) {
    next(err)
  }
})

app.post('/', schemaHandler(postProducts, 'body'), async (req, res, next) => {
  try {
    const { subCategoryName, name, note, expiryDate } = req.body

    const query = `
      INSERT INTO products(subcategory_name, name, note, expiry_date)
        VALUES($1, $2, $3, $4)
      ;
    `
    const values = [subCategoryName, name, note, expiryDate]

    await db(query, values)

    res.status(201).json({ success: true })
  } catch (err) {
    next(err)
  }
})

app.delete(
  '/',
  schemaHandler(deleteProduct, 'body'),
  async (req, res, next) => {
    try {
      const { name, expiryDate } = req.body

      const query = 'DELETE FROM products WHERE name = $1 AND expiry_date = $2;'

      await db(query, [name, expiryDate])

      res.status(200).json({ success: true })
    } catch (error) {
      next(error)
    }
  }
)

export default app
