const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const axios = require("axios");
const config = require("../config/config");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { loginId, password } = req.body;
  const user = await authService.loginUserWithLoginIdAndPassword(
    loginId,
    password
  );
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});
const refreshTokens = catchAsync(async (req, res) => {
  try {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  } catch (error) {
    // Handle the error appropriately, such as logging it and sending an error response
    console.error('Error in refreshTokens:', error);
    res.status(500).send('Internal Server Error');
  }
});

const verifyTokens = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { refreshToken } = req.body;
  const payload = jwt.verify(refreshToken, config.jwt.secret);
  res.send(authorization);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const naverOauth = catchAsync(async (req, res) => {
  const { accessToken } = req.query;
  try {
    const naverData = await axios({
      method: 'GET',
      url: 'https://openapi.naver.com/v1/nid/me',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const naverId = naverData.data.response.id;
    const userInfo = await userService.getUserWithNaverId(naverId);
    if (userInfo) {
      // If user exist already, generateAuthTokens
      const authToken = await tokenService.generateAuthTokens(userInfo);
      res.send({
        user: userInfo,
        token: authToken,
      });
    } else {
      // If not,create new user
      const user = await userService.createUserWithNaverId(naverId);
      const authToken = await tokenService.generateAuthTokens(user);
      res.send({
        user: user,
        token: authToken,
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyTokens,
  naverOauth,
};
