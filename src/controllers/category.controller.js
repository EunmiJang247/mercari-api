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

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.body);
  res.send();
});

const listCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['catName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategories(filter, options);
  res.send(result);
});
const listparentCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getallparentcategory();
  res.send(result);
});

const listClientCategory = catchAsync(async (req, res) => {
  try {
    const result = await categoryService.getallcategory();
    res.send(result);
  } catch (error) {
    // Handle the error appropriately, such as logging it and sending an error response
    console.error('Error in listClientCategory:', error);
    res.status(500).send('Internal Server Error');
  }
});

const healthcheck = (req, res) => {
  try {
    res.send('');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const deleteSeller = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.query.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  deleteSeller,
  deleteCategory,
  listCategory,
  healthcheck,
  createCategory,
  listClientCategory,
  listparentCategory,
};
