const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CS Project API description',
    version: '1.0.0',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('User: ' + req.ip)
})

setInterval(() => {
  console.log('Printing')
}, 1000 * 60 * 60)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
