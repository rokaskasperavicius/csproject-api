import joi from 'joi'

export const getSuggestions = joi.object({
  search: joi.string(),
})

export const postSuggestions = joi.object({
  name: joi.string().required(),
  subCategoryName: joi.string().required(),
  recommended: joi.string(),
})
