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
    nickName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    name: Joi.string().required(),
    transactionNumber: Joi.string().required(),
    address: Joi.string().required(),
    items: Joi.array().items(Joi.object({
      category: Joi.string().required(),
      link: Joi.string().required(),
      price: Joi.string().required(),
      quantity: Joi.string().required(),
    })).required(),
    deliveryDate: Joi.date().required(),
    inspectionNeed: Joi.boolean().required(),
    memoToStep: Joi.string().required(),
    memoToDelivery: Joi.string().required(),
    reservation: Joi.boolean().required(),
    uid: Joi.string().required(),
    utype: Joi.string().required(),
    agreeToTerms: Joi.boolean().required(),
  })};
module.exports = {
  listOrders,
  createOrder
};
