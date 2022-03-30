import express from 'express'

import sendEmail from 'email.js'
import db from 'services/db.js'

const app = express.Router()

app.get('/', async (req, res, next) => {
  try {
    const query = `
      SELECT name, to_char(expiry_date, 'YYYY-MM-DD') AS "expiryDate"
        FROM products
        WHERE (CURRENT_DATE + INTERVAL '5 days') >= expiry_date AND notified IS FALSE
        ORDER BY expiry_date ASC;
    `
    const data = await db(query)

    const info = await sendEmail(
      'expiring',
      'Your food is about to expire',
      'kasperavicius.rokas@gmail.com',
      {
        name: 'Rokas',
        products: data,
      },
      true
    )

    res.send(info?.accepted ? 'Email sent successfully to test' : info)
  } catch (err) {
    next(err)
  }
})

// app.get('/prod', async (req, res) => {
//   const info = await sendEmail(
//     'expiring',
//     'Your food is about to expire',
//     'kasperavicius.rokas@gmail.com',
//     {
//       name: 'Rokas',
//       products,
//     },
//     true
//   )

//   res.send(info?.accepted ? 'Email sent successfully to production' : info)
// })

// Sike, it won't

export default app
