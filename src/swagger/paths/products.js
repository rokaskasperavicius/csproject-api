import formatContent from 'swagger/utils.js'

const paths = {
  '/api/products': {
    get: {
      tags: ['Products'],
      summary: 'Get all products',
      description: 'Get all products with optional search queries.',
      parameters: [
        {
          name: 'filter',
          in: 'query',
          description: 'Filter by one subcategory name.',
          example: 'Vegetables',
        },
        {
          name: 'search',
          in: 'query',
          description:
            'Search for products in name, note, subcategory and category names.',
          example: 'red color, left frozen',
        },
      ],
      responses: {
        200: {
          description: 'Success getting the products',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        note: {
                          type: 'string',
                        },
                        expiryDate: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
              examples: {
                success: {
                  summary: 'The products were sent successfully',
                  value: {
                    success: true,
                    data: [
                      {
                        name: 'carrots',
                        note: 'These are really good',
                        expiryDate: '2022-03-05T00:00:00.000Z',
                      },
                      {
                        name: 'potatoes',
                        note: 'Insert a note here',
                        expiryDate: '2022-06-15T00:00:00.000Z',
                      },
                    ],
                  },
                },
              },
            },
          },
        },

        400: {
          description: 'Invalid client data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
                  errorCode: {
                    type: 'integer',
                  },
                  errorText: {
                    type: 'string',
                  },
                },
              },
              examples: {
                unknown: {
                  summary: 'Unknown error',
                  description:
                    'Some data is invalid. E.g. some query is not in the right format.',
                  value: {
                    success: false,
                    errorCode: 1,
                    errorText: 'search query is not allowed to be empty',
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Products'],
      summary: 'Insert a new product',
      requestBody: {
        required: 'true',
        content: formatContent('object', {
          subCategoryName: {
            type: 'string',
            description: 'Subcategory name',
            example: 'Vegetables',
          },
          name: {
            type: 'string',
            description: 'Name of the product',
            example: 'carrots',
          },
          note: {
            type: 'string',
            description: 'A custom note',
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
        201: {
          description: 'The product was created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
                },
              },
              examples: {
                success: {
                  summary: 'The product created successfully',
                  value: {
                    success: true,
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid client data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
                  errorCode: {
                    type: 'integer',
                  },
                  errorText: {
                    type: 'string',
                  },
                },
              },
              examples: {
                product: {
                  summary: 'The product already exists',
                  description:
                    'The product with such expiry date already exists.',
                  value: {
                    success: false,
                    errorCode: 2,
                    errorText: 'PostgreSQL internal error',
                  },
                },
                unknown: {
                  summary: 'Unknown error',
                  description:
                    'Some sent data is invalid. E.g. the product name might be too long.',
                  value: {
                    success: false,
                    errorCode: 1,
                    errorText: 'PostgreSQL internal error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

export default paths
