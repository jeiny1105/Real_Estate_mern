const express = require("express");
const router = express.Router();

/* 🔹 Middleware */
const authenticate = require("../../middlewares/auth-middleware");

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
router.post("/:propertyId", authenticate, addToWishlist);

// ❌ Remove from wishlist
router.delete("/:propertyId", authenticate, removeFromWishlist);

// 📥 Get all wishlist items
router.get("/", authenticate, getWishlist);

module.exports = router;