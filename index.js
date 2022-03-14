const express = require('express')
const app = express()
const sslRedirect = require('heroku-ssl-redirect')
// const { Pool } = require('pg')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')

require('dotenv').config()

// Routes
const categoriesRouter = require('#routes/categories.js')
const productsRouter = require('#routes/products.js')
const emailRouter = require('#routes/email.js')

// Swagger
const swagger = require('#swagger/index.js')

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Setup CORS
app.use(cors(corsOptions))

// Makes sure that https is the default protocol
app.use(sslRedirect.default())

app.use(express.json())

app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/email', emailRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

app.get('/', (req, res) => {
  res.redirect('/docs')
})

// Handle 404 routes
app.all('*', (req, res, next) => {
  next({
    message: `Route ${req.path} with method ${req.method} not found`,
  })
})

// Handle all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    errorCode: error.errorCode,
    errorText: error.message,
  })
})

console.log('Random mf')

// Setup server
const port = process.env.PORT || 5000

app.listen(port)
