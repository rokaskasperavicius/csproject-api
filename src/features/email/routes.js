import express from 'express'

import { sendEmail, getEmailInfo } from 'utils/email'

const app = express.Router()

app.get('/force', async (req, res) => {
  const success = await sendEmail()

  if (success) {
    res.send('Email sent')
  }

  res.send('No products are expiring')
})

app.get('/config', async (req, res, next) => {
  try {
    const { name, email, range } = await getEmailInfo()

    res.json({
      success: true,
      data: {
        name,
        email,
        range,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default app
