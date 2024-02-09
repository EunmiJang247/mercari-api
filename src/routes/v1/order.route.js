const express = require('express');
const orderController = require('../../controllers/orders.controller');
const categoryController = require('../../controllers/category.controller');
const { isAuth } = require("../../middlewares/auth");

const router = express.Router();

router.get('/category', isAuth, categoryController.listClientCategory);
// router.post('/', orderController.create);


module.exports = router;
