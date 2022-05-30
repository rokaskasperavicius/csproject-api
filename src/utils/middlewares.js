import joi from 'joi'

// Utils
import { PSQL_CODES } from 'utils/constants'

export const errorHandler = (error, req, res, next) => {
  const status = error.status || 400
  const code = error.errorCode || PSQL_CODES.DEFAULT
  const text = error.message || 'Something went wrong'

  res.status(status).json({
    success: false,
    errorCode: code,
    errorText: text,
  })
}

export const schemaHandler = (schema, property) => {
  return (req, res, next) => {
    try {
      req[property] = {
        ...req[property],
        ...joi.attempt(req[property], schema, { convert: true }),
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}
