const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { ordersService } = require("../services");
const { crawlingService } = require("../services");

const listOrders = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "dateFrom", "dateTo"]);
  const result = await ordersService.queryOrders(options);
  res.send(result);
});
const createCrawling = catchAsync(async (req, res) => {
  console.log(req.body.links)
  const result = await crawlingService.createCrawling(req.body.links);
  res.send(result);
});

module.exports = {
  listOrders,
  createCrawling,
};
