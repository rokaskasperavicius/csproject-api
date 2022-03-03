const express = require('express')
const app = express.Router()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
})

app.get('/', async (req, res) => {
  const client = await pool.connect()

  client.query('SELECT name FROM categories', (err, result) => {
    client.release()

    if (err) {
      res.json({ success: false })
    } else {
      res.json({
        success: true,
        data: result.rows.map(({ name }) => name),
      })
    }
  })
})

app.get('/sub-categories', async (req, res) => {
  const { categoryName } = req.query

  const client = await pool.connect()

  client.query(
    `
    SELECT name
      FROM sub_categories
      WHERE category_id = (SELECT id FROM categories WHERE name = '${categoryName.toLowerCase()}')
  `,
    (err, result) => {
      client.release()

      if (err) {
        res.json({ success: false })
      } else {
        res.json({
          success: true,
          data: result.rows.map(({ name }) => name),
        })
      }
    }
  )
})

module.exports = app
