const express = require('express')
const app = express.Router()

const ERROR_CODES = require('#base/constants.js')
const db = require('#services/db.js')

app.get('/', async (req, res, next) => {
  try {
    const data = await db('SELECT name, note FROM products')

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
      const error = new Error('Missing full request body')
      error.errorCode = ERROR_CODES.MISSING_DATA

      throw error
    }

    const query = `
      INSERT INTO products(sub_category_id, name, note, expiry_date)
        VALUES(
        (SELECT id
          FROM sub_categories
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

module.exports = app
