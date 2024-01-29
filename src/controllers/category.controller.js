const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const user = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(user);
});


const listCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['catName']);
  console.log(filter)
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategories(filter, options);
  //  console.log(result);
  res.send(result);
});
const deleteSeller = catchAsync(async (req, res) => {
  console.log(req);
  await userService.deleteUserById(req.query.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  deleteSeller,
  listCategory,
  createCategory,
};
