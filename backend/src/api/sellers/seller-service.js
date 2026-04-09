const sellerRepository = require("./seller-repository");
const AppError = require("../../utils/app-error");

const Property = require("../models/property-model");
const Inquiry = require("../models/inquiry-model"); 

const getMySellerProfile = async (userId) => {
  const seller = await sellerRepository.findSellerByUserId(userId);

  if (!seller) {
    throw new AppError("Seller profile not found", 404);
  }

  /* 🔥 REAL COUNTS */

  const totalProperties = await Property.countDocuments({
    seller: seller.user._id,
  });

  const activeListings = await Property.countDocuments({
    seller: seller.user._id,
    status: "Available", // or "Active" based on your enum
  });

  const bookings = await Inquiry.countDocuments({
    seller: seller.user._id,
    status: "Visit Scheduled",
  });

  return {
    id: seller._id,

    name: seller.user?.name,
    email: seller.user?.email,
    phone: seller.user?.phone,

    companyName: seller.companyName,
    gstNumber: seller.gstNumber,
    status: seller.status,
    createdAt: seller.createdAt,

    stats: {
      totalProperties,
      activeListings,
      bookings,
    },
  };
};

/**
 * Update seller profile
 */
const updateMySellerProfile = async (userId, data) => {
  const seller = await sellerRepository.findSellerByUserId(userId);

  if (!seller) {
    throw new AppError("Seller profile not found", 404);
  }

  const updatedSeller = await sellerRepository.updateSellerProfile(
    seller._id,
    data
  );

  return {
    id: updatedSeller._id,
    companyName: updatedSeller.companyName,
    gstNumber: updatedSeller.gstNumber,
    status: updatedSeller.status,
  };
};

module.exports = {
  getMySellerProfile,
  updateMySellerProfile,
};