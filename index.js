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

// Email
const sendEmail = require('./email.js')

const products = [
  {
    name: 'Carrots',
    expires: new Date('2022/03/06'),
  },
  {
    name: 'Milk',
    expires: new Date('2022/03/06'),
  },
  {
    name: 'Chicken',
    expires: new Date('2022/03/06'),
  },
]

app.get('/mail', async (req, res) => {
  const info = await sendEmail(
    'expiring',
    'Your food is about to expire',
    'kasperavicius.rokas@gmail.com',
    {
      name: 'Rokas',
      products,
    }
  )

  res.send(info?.accepted ? 'Email sent successfully to test' : info)
})

app.get('/mailToProd', async (req, res) => {
  const info = await sendEmail(
    'expiring',
    'Your food is about to expire',
    'kasperavicius.rokas@gmail.com',
    {
      name: 'Rokas',
      products,
    },
    true
  )

  res.send(info?.accepted ? 'Email sent successfully to production' : info)
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
