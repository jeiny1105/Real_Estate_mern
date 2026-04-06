const userService = require("./user-service");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * @desc   Get logged-in user's profile
 * @route  GET /api/v1/users/me
 * @access Protected
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateMe(
    req.user.id,
    req.body,
    req.file || null
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile, // ✅ ADD THIS
};