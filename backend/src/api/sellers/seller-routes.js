const express = require("express");
const router = express.Router();

const sellerController = require("./seller-controller");
const authenticate = require("../../middlewares/auth-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

/* 🔹 Validation */
const {
  updateSellerProfileSchema,
} = require("../../validations/seller-validation");

/**
 * Seller Profile
 */
router.get(
  "/me",
  authenticate,
  sellerController.getMyProfile
);

router.patch(
  "/me",
  authenticate,
  validateRequest(updateSellerProfileSchema),
  sellerController.updateMyProfile
);

module.exports = router;