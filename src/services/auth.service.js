const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

/**
 * Login with username and password
 * @param {string} loginId
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithLoginIdAndPassword = async (loginId, password) => {
  const user = await userService.getUserByUserId(loginId);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect login Id or password"
    );
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken);
    const user = await userService.getUserById(refreshTokenDoc._id);

    if (!user) {
      throw new Error();
    }
    // var newToken = await tokenService.generateAuthTokens(user);

    // return newToken;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

module.exports = {
  loginUserWithLoginIdAndPassword,
  logout,
  refreshAuth,
};
