const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { tokenService } = require("../services");
const { User } = require("../models");

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = await tokenService.verifyToken(token);
    if (decoded) {
      next();
    }
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const isSellerAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = await tokenService.verifyToken(token);
    const user = await User.findById(decoded._id);
    if(user.role === 'admin' || user.role === 'Seller') {
      if (decoded) {
        next();
      }
    } else {
      res.status(401).send({
        message: err.message,
      });
    }

  } catch (err) {
    res.status(401).send({
      message: '로그인이 안되어있습니다',
    });
  }
};

module.exports = {
  isAuth,
  isSellerAuth,
};
