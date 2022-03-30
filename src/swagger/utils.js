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

export default formatContent
