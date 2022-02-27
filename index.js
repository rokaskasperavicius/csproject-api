const express = require('express')
const app = express()
const { Pool } = require('pg')
const port = process.env.PORT || 5000

const cors = require('cors')

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

require('dotenv').config()

app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

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

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  },
})

/**
 * @swagger
 *  /product:
 *    post:
 *      tags: [Products]
 *      summary: Add a new product
 *      description: Add a new product with a given category and sub-category.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                categoryName:
 *                  type: string
 *                  description: Category name
 *                  example: food
 *                subCategoryName:
 *                  type: string
 *                  description: Sub-category name
 *                  example: vegetables
 *                name:
 *                  type: string
 *                  description: Name of the product
 *                  example: carrots
 *                note:
 *                  type: string
 *                  description: User specific custom note
 *                  example: These carrots are really good
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *        500:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 */
app.post('/product', async (req, res) => {
  const { categoryName, subCategoryName, name, note } = req.body

  const client = await pool.connect()

  client.query(
    `
    INSERT INTO PRODUCTS(sub_category_id, name, note)
      VALUES(
      (SELECT id
        FROM sub_categories
        WHERE name = '${subCategoryName.toLowerCase()}' AND category_id = (SELECT id FROM categories WHERE name = '${categoryName.toLowerCase()}')
      ),
      '${name}',
      '${note}'
    );
  `,
    (err) => {
      client.release()

      if (err) {
        console.log(err)
        res.json({ success: false })
      } else {
        res.json({ success: true })
      }
    }
  )
})

setInterval(() => {
  console.log('Printing')
}, 1000 * 60 * 60)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// app.get('/test', async (req, res) => {
//   const client = await pool.connect()

//   client.query('SELECT name FROM categories', (err, result) => {
//     client.release()

//     if (err) {
//       console.log(err.code)
//       res.json({ success: false })
//     } else {
//       res.json({
//         success: true,
//         data: result.rows.map(({ name }) => name),
//       })
//     }
//   })
// })
