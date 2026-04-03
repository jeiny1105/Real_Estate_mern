const wishlistRepository = require("./wishlist-repository");
const AppError = require("../../utils/app-error");

/* =========================
   ADD
========================= */
const addToWishlist = async (userId, propertyId) => {
  try {
    await wishlistRepository.addToWishlist(userId, propertyId);
    return { message: "Added to wishlist" };
  } catch (error) {
    if (error.code === 11000) {
      return { message: "Already in wishlist" }; // silent success
    }
    throw error;
  }
};

/* =========================
   REMOVE
========================= */
const removeFromWishlist = async (userId, propertyId) => {
  await wishlistRepository.removeFromWishlist(userId, propertyId);
  return { message: "Removed from wishlist" };
};

/* =========================
   GET
========================= */
const getWishlist = async (userId) => {
  const data = await wishlistRepository.getUserWishlist(userId);

  // remove null properties (filtered by match)
  const cleaned = data
    .map((item) => item.property)
    .filter(Boolean);

  return cleaned;
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};