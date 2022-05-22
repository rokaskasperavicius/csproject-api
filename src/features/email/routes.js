import express from 'express'

// Utils
import { sendEmail, getEmailInfo } from 'utils/email'

// Middlewares
import { schemaHandler } from 'utils/middlewares.js'

// Services
import db from 'services/db.js'

// Schemas
import { updateConfig } from 'features/email/schema.js'

const app = express.Router()

app.get('/config', async (req, res, next) => {
  try {
    const { name, email } = await getEmailInfo()

    res.json({
      success: true,
      data: {
        name,
        email,
      },
    })
  } catch (err) {
    next(err)
  }
})

app.put(
  '/config',
  schemaHandler(updateConfig, 'body'),
  async (req, res, next) => {
    try {
      const { name, email } = req.body

      const query = 'UPDATE config SET name = $1, email = $2;'

      await db(query, [name, email])

      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  }
)

app.post('/force', async (req, res, next) => {
  try {
    await sendEmail()
    console.log('[email]: Successfully forced the email')

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

export default app
