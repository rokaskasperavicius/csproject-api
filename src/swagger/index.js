// https://swagger.io/specification/
const setup = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'CS Project API description',
    description: 'Documentation of all API routes',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
}

import productPaths from 'swagger/paths/products'
import categoryPaths from 'swagger/paths/categories'
import databasePaths from 'swagger/paths/database'
import emailPaths from 'swagger/paths/email'

setup['paths'] = {
  ...categoryPaths,
  ...productPaths,
  ...emailPaths,
  ...databasePaths,
}

export default setup
