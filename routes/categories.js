const express = require('express')
const app = express.Router()

const ERROR_CODES = require('#base/constants.js')
const db = require('#services/db.js')

app.get('/', async (req, res, next) => {
  try {
    const data = await db('SELECT name FROM categories')

    res.json({
      success: true,
      data: data.map(({ name }) => name),
    })
  } catch (err) {
    next(err)
  }
})

app.get('/sub-categories', async (req, res, next) => {
  const { categoryName } = req.query

  try {
    // Check if categoryName exists
    if (!categoryName) {
      const error = new Error('Missing categoryName')
      error.errorCode = ERROR_CODES.MISSING_DATA

      throw error
    }

    const query = `
      SELECT name
        FROM sub_categories
        WHERE category_id = (SELECT id FROM categories WHERE name = '${categoryName.toLowerCase()}')
    `

    const data = await db(query)

    res.json({
      success: true,
      data: data.map(({ name }) => name),
    })
  } catch (err) {
    next(err)
  }
})

module.exports = app
