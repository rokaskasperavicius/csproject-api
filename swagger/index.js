// https://swagger.io/specification/
const setup = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'CS Project API description',
    description: 'My User Project Application API',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
}

const productPaths = require('#swagger/paths/products.js')
const categoryPaths = require('#swagger/paths/categories.js')

setup['paths'] = {
  ...categoryPaths,
  ...productPaths,
}

module.exports = setup
