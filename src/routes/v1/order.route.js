const express = require("express");
const orderController = require("../../controllers/orders.controller");
const categoryController = require("../../controllers/category.controller");
const orderValidation = require("../../validations/order.validation");
const router = express.Router();
const validate = require("../../middlewares/validate");
const { isSellerAuth } = require("../../middlewares/auth");

router.get("/healthcheck", categoryController.healthcheck);
router.get("/category", categoryController.listClientCategory);
router.post("/createorder", validate(orderValidation.createOrder), orderController.createOrder);
router.post("/createdraftorder", orderController.createDraftOrder);
router.put("/updateorder", orderController.updateOrder);
router.get("/getorderbyid", orderController.getorder);
router.delete("/deleteorderbyid", isSellerAuth, orderController.deleteorder);


router.get(
  "/orders-listing", orderController.listOrdersbyiser
);

module.exports = router;
