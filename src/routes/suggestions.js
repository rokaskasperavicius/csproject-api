import express from 'express'

import ERROR_CODES from 'constants.js'
import customError from 'customError.js'
import db from 'services/db.js'

const app = express.Router()

app.get('/', async (req, res, next) => {
  const { search } = req.query

  try {
    if (!search) {
      throw customError('Missing query', ERROR_CODES.MISSING_DATA)
    }

    // https://stackoverflow.com/questions/60257510/postgres-node-search-query-using-like-how-to-set
    // https://www.postgresqltutorial.com/postgresql-coalesce/
    const query = `
      SELECT S.id, S.name, COALESCE(S.recommended, '') as recommended, SC.name as "subCategoryName", C.name as "categoryName"
        FROM suggestions S
        JOIN subcategories SC ON S.subcategory_id = SC.id
        JOIN categories C ON C.id = SC.category_id
        WHERE S.name LIKE CONCAT($1::text, '%')
        ORDER BY S.name ASC
      ;
    `

    const data = await db(query, [search])

    res.json({
      success: true,
      data,
    })
  } catch (err) {
    next(err)
  }
})

export default app
