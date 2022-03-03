const express = require('express')
const app = express()
const sslRedirect = require('heroku-ssl-redirect')
const { Pool } = require('pg')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')

require('dotenv').config()

// Routes
const categoriesRouter = require('#routes/categories.js')
const productsRouter = require('#routes/products.js')

// Swagger
const swagger = require('#swagger/index.js')

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

const nodemailer = require('nodemailer')

app.get('/mail', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'SendinBlue',
    auth: {
      user: 'goodname258@gmail.com',
      pass: process.env.SEND_IN_BLUE_AUTH,
    },
  })

  var mailOptions = {
    from: 'no-reply@csproject.com',
    to: 'kasperavicius.rokas@gmail.com',
    subject: 'Your food is about to expire',
    text: 'Your carrots will expire in 10 hours :(',
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send(error)
    } else {
      res.send(info.response)
    }
  })
})

// Setup CORS
app.use(cors(corsOptions))

// Makes sure that https is the default protocol
app.use(sslRedirect.default())

app.use(express.json())

app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

app.get('/', (req, res) => {
  res.redirect('/docs')
})

// Setup server
const port = process.env.PORT || 5000

app.listen(port)
