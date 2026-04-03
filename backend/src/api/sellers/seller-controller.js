const authService = require("../auth/auth-service");
const sellerService = require("./seller-service");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * 🏢 Register Seller (after successful payment)
 * @route POST /api/v1/auth/register/seller
 */
const registerSeller = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    companyName,
    gstNumber,
    subscriptionPlan,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  const seller = await authService.registerSeller({
    name,
    email,
    phone,
    password,
    companyName,
    gstNumber,
    subscriptionPlan,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return res.status(201).json({
    success: true,
    message: "Seller registered successfully",
    data: seller,
  });
});

/**
 * Get logged-in seller profile
 * GET /api/v1/sellers/me
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const seller = await sellerService.getMySellerProfile(
    req.user.id
  );

  return res.status(200).json({
    success: true,
    data: seller,
  });
});

/**
 * Update seller profile
 * PATCH /api/v1/sellers/me
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const seller =
    await sellerService.updateMySellerProfile(
      req.user.id,
      req.body
    );

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: seller,
  });
});

module.exports = {
  registerSeller,
  getMyProfile,
  updateMyProfile,
};