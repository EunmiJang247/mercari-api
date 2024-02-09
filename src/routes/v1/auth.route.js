const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const userController = require('../../controllers/user.controller');
const authController = require('../../controllers/auth.controller');

const auth = require('../../middlewares/auth');
const { isAuth } = require("../../middlewares/auth");

const router = express.Router();
router.put('/update-user', isAuth, userController.updateUser);
router.get('/oauth/', authController.naverOauth);
router.post(
    "/verify-tokens",
    validate(authValidation.verifyTokens),
    authController.refreshTokens
  );
module.exports = router;
