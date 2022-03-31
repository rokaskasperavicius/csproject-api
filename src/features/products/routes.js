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
      SELECT P.id, P.name, P.note, P.expiry_date as "expiryDate"
        FROM productss P
        JOIN subcategories SC ON SC.id = P.subcategory_id
        JOIN categories C ON C.id = SC.category_id
        WHERE
          ($1::integer[] IS NULL OR P.subcategory_id = ANY($1))
        AND
          ($2::text IS NULL OR CONCAT(P.name || ' ' || P.note || ' ' || SC.name || ' ' || C.name) @@ $2)
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
    const userId = 4

    const query = `
      INSERT INTO products(subcategory_id, user_id, name, note, expiry_date)
        VALUES(
        (SELECT id
          FROM subcategories
          WHERE name = $1
        ),
        $2, $3, $4, $5)
      ;
    `
    const values = [
      subCategoryName.toLowerCase(),
      userId,
      name.toLowerCase(),
      note,
      expiryDate,
    ]

    await db(query, values)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default app
