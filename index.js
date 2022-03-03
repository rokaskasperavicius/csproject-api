const express = require('express')
const app = express()
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

app.use(cors(corsOptions))

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
