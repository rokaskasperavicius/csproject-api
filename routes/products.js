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

  client.query('SELECT name, note FROM products', (err, result) => {
    client.release()

    if (err) {
      res.json({ success: false })
    } else {
      res.json({
        success: true,
        data: result.rows,
      })
    }
  })
})

app.post('/', async (req, res) => {
  const { subCategoryName, name, note } = req.body

  const client = await pool.connect()

  client.query(
    `
    INSERT INTO PRODUCTS(sub_category_id, name, note)
      VALUES(
      (SELECT id
        FROM sub_categories
        WHERE name = '${subCategoryName.toLowerCase()}'
      ),
      '${name}',
      '${note}'
    );
  `,
    (err) => {
      client.release()

      if (err) {
        console.log(err)
        res.json({ success: false })
      } else {
        res.json({ success: true })
      }
    }
  )
})

module.exports = app
