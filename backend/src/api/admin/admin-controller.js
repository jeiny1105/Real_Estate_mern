const adminService = require("./admin-service");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/app-error");

/**
 * @desc   Get all users (Admin only)
 * @route  GET /api/v1/admin/users
 * @access Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();

  return res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * @desc   Block or unblock a user (Admin only)
 * @route  PATCH /api/v1/admin/users/:userId/status
 * @access Admin
 */
const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const updatedUser = await adminService.updateUserStatus(
    userId,
    status
  );

  return res.status(200).json({
    success: true,
    message: `User status updated to ${status}`,
    data: updatedUser,
  });
});

module.exports = {
  getAllUsers,
  updateUserStatus,
};