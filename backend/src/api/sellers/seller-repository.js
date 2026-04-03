const Seller = require("../models/seller-model");

/**
 * Create Seller
 * @param {Object} data
 */
const createSeller = async (data) => {
  return await Seller.create(data);
  
};

/**
 * Find seller by user ID
 * @param {string} userId
 */
const findSellerByUserId = async (userId) => {
  return await Seller
    .findOne({ user: userId })
    .populate("user", "name email phone");
};

/**
 * Find seller by ID
 * @param {string} sellerId
 */
const findSellerById = async (sellerId) => {
  return await Seller.findById(sellerId);
};

/**
 * Update seller profile
 */
const updateSellerProfile = async (sellerId, data) => {
  return await Seller.findByIdAndUpdate(
    sellerId,
    data,
    { new: true, runValidators: true }
  );
};

/**
 * Update seller status
 * @param {string} sellerId
 * @param {string} status
 */
const updateSellerStatus = async (sellerId, status) => {
  return await Seller.findByIdAndUpdate(
    sellerId,
    { status },
    { new: true }
  );
};


/**
 * Soft block seller
 */
const blockSeller = async (sellerId) => {
  return await Seller.findByIdAndUpdate(
    sellerId,
    { status: "Blocked" },
    { new: true }
  );
};

module.exports = {
  createSeller,
  findSellerByUserId,
  findSellerById,
  updateSellerProfile,
  updateSellerStatus,
  blockSeller,
};
