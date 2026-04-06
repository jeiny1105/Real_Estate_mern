const express = require("express");
const router = express.Router();

/* 🔹 Middleware */
const authenticate = require("../../middlewares/auth-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

/* 🔹 Validation */
const {
  propertyIdParamSchema,
} = require("../../validations/wishlist-validation");

/* 🔹 Controller */
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("./wishlist-controller");

/* =========================
   ROUTES
========================= */

// ➕ Add to wishlist
router.post(
  "/:propertyId",
  authenticate,
  validateRequest(propertyIdParamSchema, "params"),
  addToWishlist
);

// ❌ Remove from wishlist
router.delete(
  "/:propertyId",
  authenticate,
  validateRequest(propertyIdParamSchema, "params"),
  removeFromWishlist
);

// 📥 Get all wishlist items
router.get(
  "/",
  authenticate,
  getWishlist
);

module.exports = router;