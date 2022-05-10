import formatContent from 'swagger/utils.js'

const paths = {
  '/api/categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all categories',
      description: 'Get all names of all existing categories',
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
                type: 'string',
              },
              example: ['foods', 'medicine'],
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
  '/api/categories/sub-categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all sub-categories',
      description: 'Get all names of all existing sub-categories',
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
          description: 'Success',
          content: formatContent('object', {
            success: {
              type: 'boolean',
              example: 'true',
            },
            data: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['vegetables', 'fruits'],
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

export default paths
