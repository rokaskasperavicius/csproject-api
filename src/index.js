import express from 'express'
import sslRedirect from 'heroku-ssl-redirect'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import favicon from 'serve-favicon'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'

const app = express()
app.use(favicon('./public/favicon.ico'))

// Features
import suggestionsRouter from 'features/suggestions/routes'
import categoriesRouter from 'features/categories/routes'
import productsRouter from 'features/products/routes'
import emailRouter from 'features/email/routes'

// Middlewares
import { errorHandler } from 'utils/middlewares'

// Swagger
import swagger from 'swagger/index.js'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://csproject-dashboard.herokuapp.com',
    'https://cs-project-client.herokuapp.com',
  ],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Setup CORS
app.use(cors(corsOptions))

// Makes sure that https is the default protocol
app.use(sslRedirect())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/suggestions', suggestionsRouter)
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
app.use(errorHandler)

// Setup server
const port = process.env.PORT || 5000

console.log('Server ready on port ' + port)
app.listen(port)
