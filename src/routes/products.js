import express from 'express'

import ERROR_CODES from 'constants.js'
import customError from 'customError.js'
import db from 'services/db.js'

const app = express.Router()

app.get('/', async (req, res, next) => {
  let { filter, search, orderby, direction } = req.query

  const orderByOptions = {
    name: 'name',
    note: 'note',
    expiry: 'expiry_date',
  }

  const directionOptions = {
    asc: 'asc',
    desc: 'desc',
  }

  // Prevents SQL injection attacks and normalizes names for psql tables
  orderby = orderByOptions[orderby] || 'name'
  direction = directionOptions[direction] || 'asc'

  /**
   * filter - filter all products by sub-category ids (default = all sub-categories)
   * seatch - search from all filtered products (default = no search)
   * orderby - order all results by a column (default = name)
   * isinverted - asc or desc for order by (default = false)
   */
  try {
    // https://stackoverflow.com/questions/45938494/postgresql-conditional-where-clause
    // https://stackoverflow.com/questions/56089400/postgres-sql-could-not-determine-data-type-of-parameter-by-hibernate
    const query = `
      SELECT P.id, P.name, P.note, P.expiry_date as "expiryDate"
        FROM products P
        JOIN subcategories SC ON SC.id = P.subcategory_id
        JOIN categories C ON C.id = SC.category_id
        WHERE
          ($1::integer[] IS NULL OR P.subcategory_id = ANY($1))
        AND
          ($2::text IS NULL OR to_tsvector('english', P.name || ' ' || P.note || ' ' || SC.name || ' ' || C.name) @@ plainto_tsquery('english', $2))
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

app.post('/', async (req, res, next) => {
  const { subCategoryName, name, note, expiryDate } = req.body

  try {
    // Check if all request body variables exist
    if (!subCategoryName || !name || !note || !expiryDate) {
      throw customError('Missing full request body', ERROR_CODES.MISSING_DATA)
    }

    const query = `
      INSERT INTO products(subcategory_id, name, note, expiry_date)
        VALUES(
        (SELECT id
          FROM subcategories
          WHERE name = '${subCategoryName?.toLowerCase()}'
        ),
        '${name}',
        '${note}',
        '${expiryDate}'
      );
    `

    await db(query)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default app
