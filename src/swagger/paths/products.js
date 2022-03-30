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
          description: 'Filter by subcategory ids.',
          example: '1,3,6',
        },
        {
          name: 'search',
          in: 'query',
          description:
            'Search for products in name, note, subcategory and category names.',
          example: 'red color, left frozen',
        },
        {
          name: 'orderby',
          in: 'query',
          description: 'Order products by either name, note or expiry date.',
          default: 'name',
          example: 'expiry',
        },
        {
          name: 'direction',
          in: 'query',
          description:
            'Specify which direction to order products (asc or desc)',
          default: 'asc',
          example: 'desc',
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
                type: 'object',
              },
              example: [
                {
                  id: 14,
                  name: 'carrots',
                  note: 'These are really good',
                  expiryDate: '2022-03-05T00:00:00.000Z',
                },
                {
                  id: 34,
                  name: 'potatoes',
                  note: 'Insert a note here',
                  expiryDate: '2022-06-15T00:00:00.000Z',
                },
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
            errorCode: {
              type: 'integer',
              example: 2,
            },
            errorText: {
              type: 'string',
              example: 'Invalid query',
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

export default paths
