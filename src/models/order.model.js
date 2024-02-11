const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { array, boolean } = require("joi");
const ordersSchema = mongoose.Schema(
  {
    nickName: {
      type: String,
      required: false,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    transactionNumber: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    items: {
      type: [],
      required: false,
      trim: true,
    },
    deliveryDate: {
      type: Date,
      required: false,
      trim: true,
    },
    inspectionNeed: {
      type: String,
      required: false,
      trim: true,
    },
    memoTaStep: {
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
      type: String,
      required: false,
      trim: true,
    },
    uid: {
      type: String,
      required: true,
      trim: true,
    },
    agreeToTerms: {
      type: Boolean,
      required: false,
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
