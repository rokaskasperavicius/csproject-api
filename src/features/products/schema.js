import joi from 'joi'

export const getProducts = joi.object({
  filter: joi.string(),
  search: joi.string(),
  orderby: joi
    .string()
    .replace(/expiry/gi, 'expiry_date')
    .valid('name', 'note', 'expiry_date')
    .default('name'),
  direction: joi.string().valid('asc', 'desc').default('asc'),
})

export const postProducts = joi.object({
  subCategoryName: joi.string().required(),
  name: joi.string().required(),
  note: joi.string(),
  expiryDate: joi.string().isoDate(),
})
