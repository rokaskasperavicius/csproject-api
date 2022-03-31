import joi from 'joi'

export const getSuggestions = joi.object({
  search: joi.string().required(),
})
