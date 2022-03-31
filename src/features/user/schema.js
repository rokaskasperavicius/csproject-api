import joi from 'joi'

export const loginUser = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required(),
  email: joi.string().required().email(),
})
