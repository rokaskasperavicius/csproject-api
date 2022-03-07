const express = require('express')
const app = express.Router()

const sendEmail = require('#base/email.js')
const db = require('#services/db.js')

app.get('/', async (req, res) => {
  try {
    const query = `
      SELECT name, to_char(expiry_date, 'YYYY-MM-DD') AS "expiryDate"
        FROM products
        WHERE (CURRENT_DATE + INTERVAL '5 days') >= expiry_date AND has_notified IS FALSE
        ORDER BY expiry_date ASC;
    `
    const data = await db(query)

    sendEmail(
      'expiring',
      'Your food is about to expire',
      'kasperavicius.rokas@gmail.com',
      {
        name: 'Rokas',
        products: data,
      }
    ).then((info) => {
      res.send(info?.accepted ? 'Email sent successfully to test' : info)
    })
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

module.exports = app
