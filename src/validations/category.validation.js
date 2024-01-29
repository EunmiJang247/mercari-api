const Joi = require('joi');
const listCategory = {
  query: Joi.object().keys({
    catName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const createCategory = {
  body: Joi.object().keys({
    prodNmaeEng: Joi.string().required(),
    prodNmaeko: Joi.string().required(),
    parentCatName: Joi.string().required(),
    hscCode: Joi.number().required(),
  }),
};
module.exports = {
  listCategory,
  createCategory
};
