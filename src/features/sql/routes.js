import express from 'express'

// Services
import db from 'services/db.js'

// Constants
import { RESET_SQL_QUERY } from 'utils/constants'

const app = express.Router()

app.get('/', (req, res) => {
  res.download('public/DDL.sql')
})

app.get('/reset', async (req, res, next) => {
  try {
    const query = RESET_SQL_QUERY

    await db(query)

    res.json({
      success: true,
    })
  } catch (err) {
    next(err)
  }
})

export default app
