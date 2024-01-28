const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const sellerUserController = require('../../controllers/seller.user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/seller-listing', validate(authValidation.listSeller), sellerUserController.listSeller);

module.exports = router;
