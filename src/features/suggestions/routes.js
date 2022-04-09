import express from 'express'

// Middlewares
import { schemaHandler } from 'utils/middlewares.js'

// Services
import db from 'services/db.js'

// Schemas
import { getSuggestions, postSuggestions } from 'features/suggestions/schema.js'

const app = express.Router()

app.get('/', schemaHandler(getSuggestions, 'query'), async (req, res, next) => {
  console.log(req.query)
  const { search } = req.query

  try {
    // https://stackoverflow.com/questions/60257510/postgres-node-search-query-using-like-how-to-set
    // https://www.postgresqltutorial.com/postgresql-coalesce/
    const query = `
      SELECT S.id, S.name, COALESCE(S.recommended, '') as recommended, SC.name as "subCategoryName", C.name as "categoryName"
        FROM suggestions S
        JOIN subcategories SC ON S.subcategory_id = SC.id
        JOIN categories C ON C.id = SC.category_id
        WHERE S.name LIKE CONCAT('%', $1::text, '%')
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

app.post(
  '/',
  schemaHandler(postSuggestions, 'body'),
  async (req, res, next) => {
    const { name, subCategoryName, recommended } = req.body

    try {
      const query = `
        INSERT INTO suggestions(name, subcategory_id, recommended)
          VALUES(LOWER($1), (SELECT id from subcategories WHERE name = $2), LOWER($3))
      `

      await db(query, [name, subCategoryName, recommended])

      res.json({
        success: true,
      })
    } catch (err) {
      next(err)
    }
  }
)

export default app
