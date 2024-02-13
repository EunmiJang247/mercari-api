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
const listOrdersbyiser = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "dateFrom", "dateTo", "uid"]);
  const result = await ordersService.queryOrdersByUser(options);
  res.send(result);
});

const createCrawling = catchAsync(async (req, res) => {
  const result = await crawlingService.createCrawling(req.body.links);
  res.send(result);
});
const createOrder = catchAsync(async (req, res) => {
  const order = await ordersService.createOrder(req.body);
  res.status(httpStatus.CREATED).send(order);
});
const updateOrder = catchAsync(async (req, res) => {
  const order = await ordersService.updateOrder(req.body);
  res.status(httpStatus.CREATED).send(order);
});
const getorder = catchAsync(async (req, res) => {
  const order = await ordersService.getOrder(req.query.id);
  res.status(httpStatus.CREATED).send(order);
});

const deleteorder = catchAsync(async (req, res) => {
  const order = await ordersService.deleteOrderById(req.query.id);
  res.status(httpStatus.CREATED).send(order);
});

module.exports = {
  listOrders,
  createCrawling,
  createOrder,
  listOrdersbyiser,
  getorder,
  updateOrder,
  deleteorder,
};
