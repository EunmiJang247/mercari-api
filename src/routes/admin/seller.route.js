const express = require("express");
const validate = require("../../middlewares/validate");
const sellerValidation = require("../../validations/seller.validation");
const categoryValidation = require("../../validations/category.validation");
const orderValidation = require("../../validations/order.validation");
const categoryController = require("../../controllers/category.controller");
const sellerUserController = require("../../controllers/seller.controller");
const ordersController = require("../../controllers/orders.controller");

const { isAuth } = require("../../middlewares/auth");
const router = express.Router();
router.get(
  "/seller-listing",
  isAuth,
  validate(sellerValidation.listSeller),
  sellerUserController.listSeller
);
router.delete(
  "/delete-seller",
  isAuth,
  validate(sellerValidation.deleteSeller),
  sellerUserController.deleteSeller
);
router.post(
  "/add-category",
  isAuth,
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);
router.post(
  "/category-delete",
  isAuth,
  validate(categoryValidation.deleteCategory),
  categoryController.deleteCategory
);
router.get(
  "/subcategory-listing",
  isAuth,
  validate(categoryValidation.listCategory),
  categoryController.listCategory
);
router.get(
  "/category-listing",
  isAuth,
  categoryController.listparentCategory
);
router.get("/orders-listing", isAuth, ordersController.listOrders);
router.post("/orders-crawling", ordersController.createCrawling);

module.exports = router;
