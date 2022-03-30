import formatContent from 'swagger/utils.js'

const paths = {
  '/api/suggestions': {
    get: {
      tags: ['Suggestions'],
      summary: 'Get all suggested products',
      description: 'Get all suggested products based on the search query',
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
}

export default paths
