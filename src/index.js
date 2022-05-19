import express from 'express'
import sslRedirect from 'heroku-ssl-redirect'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import favicon from 'serve-favicon'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import schedule from 'node-schedule'
import 'dotenv/config'

// Features
import suggestionsRouter from 'features/suggestions/routes'
import categoriesRouter from 'features/categories/routes'
import productsRouter from 'features/products/routes'
import emailRouter from 'features/email/routes'
import sqlRouter from 'features/sql/routes'

// Utils
import { errorHandler } from 'utils/middlewares'
import { sendEmail } from 'utils/email'

// Swagger
import swagger from 'swagger/index.js'

const app = express()
app.use(favicon('./public/icon.ico'))

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

// Allowed urls for accessing our API
const corsOptions = {
  origin: [
    // For development
    'http://localhost:3000',

    // For production
    'https://csproject-client.herokuapp.com',
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
app.use('/sql', sqlRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

app.get('/', (req, res) => {
  res.redirect('/docs')
})

/**
 * Create a cron job to check for expiring products every day at 8am UTC (0 0 8 * * *)
 *
 * You can check how the cron job parser works here:
 * https://bradymholt.github.io/cron-expression-descriptor/
 */
const job = schedule.scheduleJob('0 0 8 * * *', async () => {
  try {
    await sendEmail()
  } catch {
    console.error('Cron job failed to send the email')
  }
})

// Route to stop the cron job
app.get('/cron/stop', (req, res) => {
  job.cancel()
  res.send('Cron job stopped. Re-deploy the api to start the cron job again')
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
console.log('Cron job is listening every day at 8am UTC time')

app.listen(port)
