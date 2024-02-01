const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ordersService } = require('../services');


const listOrders = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'dateFrom', 'dateTo']);
  const result = await ordersService.queryOrders(options);

  console.log(result)
  res.send(result);
});


module.exports = {
  listOrders,
};
