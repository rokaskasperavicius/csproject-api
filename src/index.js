import express from 'express'
import sslRedirect from 'heroku-ssl-redirect'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import axios from 'axios'
import favicon from 'serve-favicon'
import path from 'path'
import 'dotenv/config'

const app = express()
app.use(favicon('./public/favicon.ico'))

// Routes
import suggestionsRouter from 'routes/suggestions.js'
import categoriesRouter from 'routes/categories.js'
import productsRouter from 'routes/products.js'
import emailRouter from 'routes/email.js'

// Swagger
import swagger from 'swagger/index.js'

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Setup CORS
app.use(cors(corsOptions))

// Makes sure that https is the default protocol
app.use(sslRedirect())

app.use(express.json())

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

import os from 'os'

// Handle all errors
app.use(async (error, req, res, next) => {
  console.log(error.stack)
  // const errorr = new Error('Test')

  const { ip } = req
  const browser = req.headers['user-agent']
  const host = os.hostname()

  axios.post(process.env.DISCORD_WEBHOOK, {
    content: '```' + error.stack + '```',
    embeds: [
      {
        color: 14362664,
        fields: [],
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: 'IP',
            value: ip,
            inline: true,
          },
          {
            name: 'Browser',
            value: browser,
            inline: true,
          },
        ],
        footer: {
          text: 'Server',
          icon_url:
            'https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png',
        },
      },
    ],
  })

  res.status(error.status || 500).json({
    success: false,
    errorCode: error.errorCode,
    errorText: error.message,
  })
})

// Setup server
const port = process.env.PORT || 5000

app.listen(port)
