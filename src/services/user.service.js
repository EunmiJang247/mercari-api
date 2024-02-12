const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isLoginIdTaken(userBody.loginId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Login Id already taken");
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in getUserById:', error);
    throw error; // Propagate the error for higher-level handling
  }
};


/**
 * Get user by loginID
 * @param {string} logiId
 * @returns {Promise<User>}
 */
const getUserByUserId = async (loginId) => {
  try {
    const user = await User.findOne({ loginId });
    return user;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in getUserByUserId:', error);
    throw error; // Propagate the error for higher-level handling
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};
const createUserWithNaverId = async (naverId) => {
   const result = await User.create({ naverId });
   return result;
};

const getUserWithNaverId = async (naverId) => {
  return User.findOne({ naverId });
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};


module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByUserId,
  deleteUserById,
  createUserWithNaverId,
  getUserWithNaverId,
  updateUserById
};
