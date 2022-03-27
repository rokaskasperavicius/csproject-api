const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')

const ERROR_CODES = require('#base/constants.js')
const customError = require('#base/customError.js')
const db = require('#services/db.js')

// /api/register -> body {firstName, lastName, password, email}
app.get('/', async (req, res, next) => {
  const { firstName, lastName, password, email } = req.body

  try {
    if (!firstName || !lastName || !password || !email) {
      throw customError('Missing body', ERROR_CODES.MISSING_DATA)
    }

    const query = `
      INSERT INTO users(first_name, last_name, email, password)
        VALUES($1, $2, $3, $4)
      ;
    `

    const hash = await bcrypt.hash(password, 2)

    const values = [firstName, lastName, email, hash]

    await db(query, values)

    res.json({
      success: true,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = app
