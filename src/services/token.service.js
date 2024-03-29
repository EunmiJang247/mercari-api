const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../config/config");
const userService = require("./user.service");
const { Token } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

const generateToken = (_id, expires, type, secret = config.jwt.secret) => {
  try {
    const payload = {
      _id: _id,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in generateToken:', error);
    throw error; // Propagate the error for higher-level handling
  }
};

const saveToken = async (token, _id, expires, type, blacklisted = false) => {
  try {
    const tokenDoc = await Token.create({
      token,
      user: _id,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in saveToken:', error);
    throw error; // Propagate the error for higher-level handling
  }
};


/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
// const verifyToken = async (refreshToken) => {
//   const payload = jwt.verify(refreshToken, ctokenTypes.REFRESH);
//   if (!payload) {
//     throw new Error("Token not found");
//   } 
//   return payload;
// };


const verifyToken = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, config.jwt.secret);
    if (!payload) {
      throw new Error("Token not found");
    }
    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token has expired, handle the situation
      // For example, generate a new token or log the user out
      console.error('TokenExpiredError:', error.message);
      // throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired');
    } else {
      // Handle other errors
      console.error('Error verifying token:', error.message);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  try {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "days"
    );
    const accessToken = generateToken(
      user._id,
      accessTokenExpires,
      tokenTypes.ACCESS
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = generateToken(
      user._id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );
    await saveToken(
      refreshToken,
      user._id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  } catch (error) {
    // Handle the error appropriately
    console.error('Error in generateAuthTokens:', error);
    throw error; // Propagate the error for higher-level handling
  }
};


module.exports = {
  saveToken,
  verifyToken,
  generateAuthTokens,
};
