const customError = (message, code) => {
  const error = new Error(message)
  error.errorCode = code

  return error
}

export default customError
