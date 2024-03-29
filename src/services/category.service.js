const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a category
 * @param {Object}  catBody
 * @returns {Promise<Category>}
 */
const createCategory = async (catBody) => {
  return Category.create(catBody);
};

const deleteCategory = async (catBody) => {
  if(catBody.role === "child") {
    await Category.findOneAndDelete({ prodNmaeko: catBody.catName });
  }
  if(catBody.role === "parent") {
    await Category.deleteMany({ parentCatName: catBody.catName });
    await Category.findOneAndDelete({ prodNmaeko: catBody.catName });
  }
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  // console.log(filter)
  // const categories = await Category.findAll(filter, options);
  const categories = await Category.find({
    parentCatName: { $eq: filter['catName'] }
  });
  return categories;
};
const getallcategory = async () => {
  try {
    const categories = await Category.find({});
    return categories;
  } catch (error) {
    // Handle error appropriately
    console.error('Error in getallcategory:', error);
    throw error; // Propagate the error for higher-level handling
  }
};
const getallparentcategory = async () => {
  try {
    const categories = await Category.find({parentCatName: ''});
    return categories;
  } catch (error) {
    // Handle error appropriately
    console.error('Error in getallcategory:', error);
    throw error; // Propagate the error for higher-level handling
  }
};
module.exports = {
  createCategory,
  deleteCategory,
  queryCategories,
  getallcategory,
  getallparentcategory
};
