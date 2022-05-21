import joi from 'joi'

export const getProducts = joi.object({
  filter: joi.string(),
  search: joi.string(),
})

export const postProducts = joi.object({
  subCategoryName: joi.string().required(),
  name: joi.string().required(),
  note: joi.string(),
  expiryDate: joi.string().isoDate(),
})

export const deleteProduct = joi.object({
  name: joi.string().required(),
  expiryDate: joi.string().isoDate(),
})
