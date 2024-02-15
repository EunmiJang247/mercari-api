const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { array, boolean, string } = require("joi");
const ordersSchema = mongoose.Schema(
  {
    nickName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    transactionNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [],
      required: true,
      trim: true,
    },
    deliveryDate: {
      type: String,
      required: false,
      trim: true,
    },
    inspectionNeed: {
      type: Boolean,
      required: true,
      trim: true,
    },
    memoToStep: {
      type: String,
      required: false,
      trim: true,
    },
    memoToDelivery: {
      type: String,
      required: false,
      trim: true,
    },
    reservation: {
      type: Boolean,
      required: true,
      trim: true,
    },
    uid: {
      type: String,
      required: true,
      trim: true,
    },
    agreeToTerms: {
      type: Boolean,
      required: true,
    },
    utype: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
ordersSchema.plugin(toJSON);
ordersSchema.plugin(paginate);
/**
 * @typedef Order
 */
const Order = mongoose.model("Order", ordersSchema);
module.exports = Order;
