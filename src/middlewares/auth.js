const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { tokenService } = require("../services");

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = tokenService.verifyToken(token);
    if (decoded) {
      next();
    }
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};
module.exports = {
  isAuth,
};
