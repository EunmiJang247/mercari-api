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
      required: false,
      trim: true,
    },
    deliveryDate: {
      type: String,
      required: false,
      trim: true,
    },
    inspectionNeed: {
      type: Boolean,
      required: false,
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
      required: false,
      trim: true,
    },
    uid: {
      type: String,
      required: false,
      trim: true,
    },
    agreeToTerms: {
      type: Boolean,
      required: false,
    },
    utype: {
      type: String,
      required: false,
      trim: true,
    },
    isConfirm: {
      type: String,
      required: false,
      trim: true,
    },
    reservationText: {
      type: String,
      required: false,
      trim: true,
    },
    zipcode: {
      type: String,
      required: false,
      trim: true,
    },
    businessName: {
      type: String,
      required: false,
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
