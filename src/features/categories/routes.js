import express from 'express'

// Services
import db from 'services/db.js'

// Schemas
import { getSubCategories } from 'features/categories/schema.js'

// Middlewares
import { schemaHandler } from 'utils/middlewares.js'

const app = express.Router()

app.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT DISTINCT(category_name) as name FROM subcategories'
    const data = await db(query)

    res.json({
      success: true,
      data,
    })
  } catch (err) {
    next(err)
  }
})

app.get(
  '/subcategories',
  schemaHandler(getSubCategories, 'query'),
  async (req, res, next) => {
    const { categoryName } = req.query

    try {
      const query = `
        SELECT name
          FROM subcategories
          WHERE category_name = $1
      `

      const data = await db(query, [categoryName])

      res.json({
        success: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  }
)

export default app
