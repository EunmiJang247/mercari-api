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
module.exports = {
  createCategory,
  queryCategories,
  getallcategory
};