const wishlistService = require("./wishlist-service");
const asyncHandler = require("../../utils/asyncHandler");

/* ADD */
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { propertyId } = req.params;

  const result = await wishlistService.addToWishlist(
    userId,
    propertyId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/* REMOVE */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { propertyId } = req.params;

  const result = await wishlistService.removeFromWishlist(
    userId,
    propertyId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/* GET */
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const data = await wishlistService.getWishlist(userId);

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};