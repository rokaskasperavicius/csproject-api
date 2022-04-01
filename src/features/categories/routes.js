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
    const data = await db('SELECT id, name FROM categories')

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
      SELECT id, name
        FROM subcategories
        WHERE category_id = (SELECT id FROM categories WHERE name = '${categoryName.toLowerCase()}')
    `

      const data = await db(query)

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