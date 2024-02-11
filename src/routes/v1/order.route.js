const express = require('express');
const orderController = require('../../controllers/orders.controller');
const categoryController = require('../../controllers/category.controller');
const { isAuth } = require("../../middlewares/auth");

const router = express.Router();

router.get('/category', categoryController.listClientCategory);
 router.post('/createorder', orderController.createUser);
 router.get("/orders-listing", orderController.listOrdersbyiser);


module.exports = router;
