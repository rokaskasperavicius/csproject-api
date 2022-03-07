const formatContent = require('../utils.js')

const paths = {
  '/api/products': {
    get: {
      tags: ['Products'],
      summary: 'Get all products',
      responses: {
        200: {
          description: 'Success',
          content: formatContent('object', {
            success: {
              type: 'boolean',
              example: 'true',
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
              example: [
                { name: 'carrots', note: 'These are really good' },
                { name: 'potatoes', note: 'Insert a note here' },
              ],
            },
          }),
        },
        500: {
          description: 'Something went wrong',
          content: formatContent('object', {
            success: {
              type: 'boolean',
              example: 'false',
            },
          }),
        },
      },
    },
    post: {
      tags: ['Products'],
      summary: 'Add a new product',
      description: 'Add a new product with a given category and sub-category.',
      requestBody: {
        required: 'true',
        content: formatContent('object', {
          subCategoryName: {
            type: 'string',
            description: 'Sub-category name',
            example: 'vegetables',
          },
          name: {
            type: 'string',
            description: 'Name of the product',
            example: 'carrots',
          },
          note: {
            type: 'string',
            description: 'User specific custom note',
            example: 'These carrots are really good',
          },
          expiryDate: {
            type: 'string',
            description: 'ISO 8601 compliant product expiry date',
            example: '2022-03-05T23:55:44.135Z',
          },
        }),
      },
      responses: {
        200: {
          description: 'Success',
          content: formatContent('object', {
            success: {
              type: 'boolean',
              example: 'true',
            },
          }),
        },
        500: {
          description: 'Something went wrong',
          content: formatContent('object', {
            success: {
              type: 'boolean',
              example: 'false',
            },
          }),
        },
      },
    },
  },
}

module.exports = paths
