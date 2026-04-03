const express = require("express");
const router = express.Router();

const sellerController = require("./seller-controller");
const authMiddleware = require("../../middlewares/auth-middleware");

/**
 * Seller Profile
 */
router.get(
  "/me",
  authMiddleware,
  sellerController.getMyProfile
);

router.patch(
  "/me",
  authMiddleware,
  sellerController.updateMyProfile
);

module.exports = router;