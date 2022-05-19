import joi from 'joi'

export const updateConfig = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
})
