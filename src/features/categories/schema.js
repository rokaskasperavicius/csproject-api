import joi from 'joi'

export const getSubCategories = joi.object({
  categoryName: joi.string().required(),
})
