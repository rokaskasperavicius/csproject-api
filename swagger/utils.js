const formatContent = (type, properties) => {
  return {
    'application/json': {
      schema: {
        type,
        properties,
      },
    },
  }
}

module.exports = formatContent
