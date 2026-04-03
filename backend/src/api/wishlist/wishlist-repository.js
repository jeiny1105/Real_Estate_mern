const Wishlist = require("../models/wishlist-model"); // adjust path

/* =========================
   ADD TO WISHLIST
========================= */
const addToWishlist = (userId, propertyId) => {
  return Wishlist.create({
    user: userId,
    property: propertyId,
  });
};

/* =========================
   REMOVE FROM WISHLIST
========================= */
const removeFromWishlist = (userId, propertyId) => {
  return Wishlist.findOneAndDelete({
    user: userId,
    property: propertyId,
  });
};

/* =========================
   GET USER WISHLIST
========================= */
const getUserWishlist = (userId) => {
  return Wishlist.find({ user: userId })
    .populate({
      path: "property",
      match: { isDeleted: false, status: "Available" },
    })
    .sort({ createdAt: -1 });
};

/* =========================
   CHECK IF EXISTS (for UI)
========================= */
const isWishlisted = (userId, propertyId) => {
  return Wishlist.findOne({
    user: userId,
    property: propertyId,
  });
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  isWishlisted,
};