const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const subcategorySchema = mongoose.Schema(
  {
    prodNmaeko: {
      type: String,
      required: false,
      trim: true,
    },
    prodNmaeEng: {
      type: String,
      required: false,
      trim: true,
    },
    parentCatName: {
      type: String,
      required: false,
      trim: true,
    },
    hscCode: {
      type: Number,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
subcategorySchema.plugin(toJSON);
subcategorySchema.plugin(paginate);
/**
 * @typedef Category
 */
const Category = mongoose.model('Category', subcategorySchema);
module.exports = Category;
