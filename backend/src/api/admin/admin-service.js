const userRepository = require("../users/user-repository");
const AppError = require("../../utils/app-error");

/**
 * Get all users (Admin only)
 */
const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();
  return users;
};

/**
 * Block or unblock a user
 */
const updateUserStatus = async (userId, status) => {
  // 1️⃣ Allow only valid statuses
  const allowedStatuses = ["Active", "Blocked"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  // 2️⃣ Prevent blocking Admin users (safety rule)
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "Admin") {
    throw new AppError("Admin users cannot be blocked", 403);
  }

  // 3️⃣ Update status via repository
  const updatedUser = await userRepository.updateUserStatus(
    userId,
    status
  );

  return updatedUser;
};

module.exports = {
  getAllUsers,
  updateUserStatus,
};
