const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const listSeller = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteSeller = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const createCategory = {
  body: Joi.object().keys({
    catName: Joi.string().required(),
    parentCat: Joi.string().required(),
    hscCode: Joi.number().required(),
  }),
};
module.exports = {
  listSeller,
  getUser,
  updateUser,
  deleteSeller,
  createCategory
};
