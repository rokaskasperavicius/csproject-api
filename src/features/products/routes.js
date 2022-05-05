import express from 'express'

// Middlewares
import { schemaHandler } from 'utils/middlewares.js'

// Services
import db from 'services/db.js'

// Schemas
import { getProducts, postProducts } from 'features/products/schema.js'

const app = express.Router()

app.get('/', schemaHandler(getProducts, 'query'), async (req, res, next) => {
  /**
   * filter - filter all products by sub-category ids (default = all sub-categories)
   * seatch - search from all filtered products (default = no search)
   * orderby - order all results by a column (default = name)
   * isinverted - asc or desc for order by (default = false)
   *
   * https://www.postgresql.org/docs/current/textsearch-intro.html
   */
  try {
    const { filter, search, orderby, direction } = req.query

    const query = `
      SELECT P.name, P.note, P.expiry_date as "expiryDate"
        FROM products P
        JOIN subcategories SC ON SC.name = P.subcategory_name
        WHERE
          ($1::text[] IS NULL OR P.subcategory_name = ANY($1))
        AND
          ($2::text IS NULL OR CONCAT(P.name || ' ' || P.note || ' ' || SC.name || ' ' || SC.category_name) @@ $2)
        ORDER BY ${orderby} ${direction};
      `
    const values = [filter && [...filter.split(',')], search]

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

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default app
