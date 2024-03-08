const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { errorData } = require('../utils/errorData');
const { preSignS3Object, getObject } = require('../utils/upload');
const catchAsync = require('../utils/catchAsync');
const { Order } = require('../models');

const removeDataMoreThanThreeMonth = catchAsync(async (req, res) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const result = await Order.deleteMany({
      createdAt: { $lt: threeMonthsAgo }
    });
  } catch (error) {
  }
});

module.exports = {
  removeDataMoreThanThreeMonth,
};
