import express from 'express'

import { sendEmail, getEmailInfo } from 'utils/email'

const app = express.Router()

app.get('/force', async (req, res, next) => {
  try {
    await sendEmail()

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

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

export default app
