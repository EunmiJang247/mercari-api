const express = require("express");
const orderController = require("../../controllers/orders.controller");
const categoryController = require("../../controllers/category.controller");
const { isAuth } = require("../../middlewares/auth");
const orderValidation = require("../../validations/order.validation");
const router = express.Router();
const validate = require("../../middlewares/validate");

router.get("/category", categoryController.listClientCategory);
router.post("/createorder", validate(orderValidation.createOrder), orderController.createUser);
router.get(
  "/orders-listing", orderController.listOrdersbyiser
);

module.exports = router;
