import express from 'express'

import { sendEmail, getEmailInfo } from 'utils/email'

const app = express.Router()

app.get('/force', async (req, res) => {
  await sendEmail()
  res.send('Email sent if any products found to be expiring')
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
