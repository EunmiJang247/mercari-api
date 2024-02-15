const Joi = require('joi');
const listOrders = {
  query: Joi.object().keys({
    catName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const createOrder = {
  body: Joi.object().keys({
    address: Joi.string().required(),
    agreeToTerms: Joi.boolean(),
    deliveryDate: Joi.string().allow(''),
    inspectionNeed: Joi.boolean().required(),
    items: Joi.array().items(Joi.object({
      category: Joi.string().required(),
      link: Joi.string().required(),
      price: Joi.string().required(),
      quantity: Joi.string().required(),
      subcategory: Joi.string().required(),
    })).required(),
    memoToDelivery: Joi.string().allow(''),
    memoToStep: Joi.string().allow(''),
    name: Joi.string().required(),
    nickName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    transactionNumber: Joi.string().required(),
    reservation: Joi.boolean(),
    uid: Joi.string().required(),
    utype: Joi.string().required(),
  })};
module.exports = {
  listOrders,
  createOrder
};
