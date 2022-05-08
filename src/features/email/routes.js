import express from 'express'

import { sendEmail } from 'utils/email'

const app = express.Router()

app.get('/force', async (req, res) => {
  await sendEmail()
  res.send('Email sent if any products found to be expiring')
})

export default app
