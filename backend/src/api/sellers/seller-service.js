const sellerRepository = require("./seller-repository");
const AppError = require("../../utils/app-error");

/**
 * Get logged-in seller profile
 */
const getMySellerProfile = async (userId) => {

  const seller = await sellerRepository.findSellerByUserId(userId);

  if (!seller) {
    throw new AppError("Seller profile not found", 404);
  }

  return seller;
};

/**
 * Update seller profile
 */
const updateMySellerProfile = async (userId, data) => {
  const seller = await sellerRepository.findSellerByUserId(userId);

  if (!seller) {
    throw new AppError("Seller profile not found", 404);
  }

  const updatedSeller =
    await sellerRepository.updateSellerProfile(
      seller._id,
      data
    );

  return updatedSeller;
};

module.exports = {
  getMySellerProfile,
  updateMySellerProfile,
};