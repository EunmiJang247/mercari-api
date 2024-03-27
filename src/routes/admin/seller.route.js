const express = require("express");
const validate = require("../../middlewares/validate");
const sellerValidation = require("../../validations/seller.validation");
const categoryValidation = require("../../validations/category.validation");
const orderValidation = require("../../validations/order.validation");
const categoryController = require("../../controllers/category.controller");
const sellerUserController = require("../../controllers/seller.controller");
const ordersController = require("../../controllers/orders.controller");

const { isAuth, isSellerAuth } = require("../../middlewares/auth");
const router = express.Router();
router.get(
  "/seller-listing",
  isSellerAuth,
  validate(sellerValidation.listSeller),
  sellerUserController.listSeller
);
router.delete(
  "/delete-seller",
  isSellerAuth,
  validate(sellerValidation.deleteSeller),
  sellerUserController.deleteSeller
);
router.post(
  "/add-category",
  isSellerAuth,
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);
router.post(
  "/category-delete",
  isSellerAuth,
  validate(categoryValidation.deleteCategory),
  categoryController.deleteCategory
);
router.get(
  "/subcategory-listing",
  isSellerAuth,
  validate(categoryValidation.listCategory),
  categoryController.listCategory
);
router.get(
  "/category-listing",
  isSellerAuth,
  categoryController.listparentCategory
);
router.get("/orders-listing", isSellerAuth, ordersController.listOrders);
router.post("/orders-crawling", ordersController.createCrawling);

module.exports = router;
