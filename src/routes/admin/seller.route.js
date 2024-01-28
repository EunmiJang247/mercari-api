const express = require('express');
const validate = require('../../middlewares/validate');
const sellerValidation = require('../../validations/seller.user.validation');
const sellerUserController = require('../../controllers/seller.user.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();
router.get('/seller-listing', auth('read'), validate(sellerValidation.listSeller), sellerUserController.listSeller);
router.delete('/delete-seller', auth('delete'), validate(sellerValidation.deleteSeller), sellerUserController.deleteSeller);

module.exports = router;
