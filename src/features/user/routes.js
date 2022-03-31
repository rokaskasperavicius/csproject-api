import bcrypt from 'bcrypt'
import express from 'express'

// Middlewares
import { schemaHandler } from 'utils/middlewares.js'

// Services
import db from 'services/db.js'

// Schemas
import { loginUser } from 'features/user/schema.js'

const app = express.Router()

app.get(
  '/register',
  schemaHandler(loginUser, 'body'),
  async (req, res, next) => {
    const { firstName, lastName, password, email } = req.body

    try {
      const query = `
        INSERT INTO users(first_name, last_name, email, password)
          VALUES($1, $2, $3, $4)
        ;
      `

      const hash = await bcrypt.hash(password, 12)

      const values = [firstName, lastName, email, hash]

      await db(query, values)

      res.json({
        success: true,
      })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = app
