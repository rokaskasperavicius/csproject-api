import formatContent from 'swagger/utils.js'

const paths = {
  '/api/email/config': {
    get: {
      tags: ['Email'],
      summary: 'Get email config',
      responses: {
        200: {
          description: 'Success getting email config',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
                  data: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      email: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
              example: {
                success: true,
                data: {
                  name: 'Name',
                  email: 'example@domain.tld',
                },
              },
            },
          },
        },
        400: {
          description: 'Something went wrong',
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
              example: {
                success: false,
                errorCode: 1,
                errorText: 'PostgreSQL internal error',
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Email'],
      summary: 'Update email config',
      requestBody: {
        required: 'true',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
              },
            },
            example: {
              name: 'Name',
              email: 'example@domain.tld',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'The email config updated',
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
              example: {
                success: true,
              },
            },
          },
        },
        400: {
          description: 'Something went wrong',
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
              example: {
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
  '/api/email/force': {
    post: {
      tags: ['Email'],
      summary: 'Send an email',
      responses: {
        200: {
          description: 'The email was sent',
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
              example: {
                success: true,
              },
            },
          },
        },
        400: {
          description: 'Something went wrong',
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
              example: {
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
}

export default paths
