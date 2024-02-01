const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const listSeller = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});
const deleteSeller = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.query.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  listSeller,
  deleteSeller,
};
