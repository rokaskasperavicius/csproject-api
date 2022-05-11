import formatContent from 'swagger/utils.js'

const paths = {
  '/api/categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all categories',
      description: 'Get all names of all existing categories',
      responses: {
        200: {
          description: 'Success getting all categories',
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
                      type: 'string',
                    },
                  },
                },
              },
              examples: {
                success: {
                  summary: 'The categories were sent successfully',
                  value: {
                    success: true,
                    data: ['Food', 'Medicine', 'Cosmetics'],
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
                  description: 'Something went wrong',
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
  '/api/categories/subcategories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all subcategories',
      description:
        'Get all names of all subcategories belonging to one category',
      parameters: [
        {
          name: 'categoryName',
          required: 'true',
          in: 'query',
          description: 'Category name.',
          example: 'Food',
        },
      ],
      responses: {
        200: {
          description: 'Success getting subcategories',
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
                      type: 'string',
                    },
                  },
                },
              },
              examples: {
                success: {
                  summary: 'The subcategories were sent successfully',
                  value: {
                    success: true,
                    data: ['Vegetables', 'Fruits'],
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
                  description: 'Something went wrong',
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
