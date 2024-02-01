const express = require('express');
const validate = require('../../middlewares/validate');
const sellerValidation = require('../../validations/seller.validation');
const categoryValidation = require('../../validations/category.validation');
const orderValidation = require('../../validations/order.validation');
const categoryController = require('../../controllers/category.controller');
const sellerUserController = require('../../controllers/seller.controller');
const ordersController = require('../../controllers/orders.controller');

const auth = require('../../middlewares/auth');
const router = express.Router();
router.get('/seller-listing', auth('read'), validate(sellerValidation.listSeller), sellerUserController.listSeller);
router.delete('/delete-seller', auth('delete'), validate(sellerValidation.deleteSeller), sellerUserController.deleteSeller);
router.post('/add-category', auth('write'), validate(categoryValidation.createCategory), categoryController.createCategory);
router.get('/subcategory-listing', auth('read'), validate(categoryValidation.listCategory), categoryController.listCategory);
router.get('/orders-listing', auth('read'), ordersController.listOrders);


module.exports = router;
