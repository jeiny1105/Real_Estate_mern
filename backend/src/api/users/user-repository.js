const User = require("../models/user-model");

/**
 * Get all users (excluding deleted & sensitive fields)
 */
const getAllUsers = async () => {
  return await User.find({ isDeleted: false })
    .select("-password -resetToken -resetTokenExpire")
    .sort({ createdAt: -1 });
};

/**
 * Find user by email (basic – no password)
 */
const findUserByEmail = async (email) => {
  return await User.findOne({
    email,
    isDeleted: false,
  });
};

/**
 * 🔍 Find user by email (INCLUDES password) – Login purpose
 */
const findByEmail = async (email) => {
  return await User.findOne({
    email,
    isDeleted: false,
  }).select("+password");
};

/**
 * 🔥 Find user by ID (NO password)
 */
const findById = async (userId) => {
  return await User.findById(userId).select(
    "-password -resetToken -resetTokenExpire"
  );
};

/**
 * 🔥 Find user by ID WITH password (for update / security ops)
 */
const findByIdWithPassword = async (userId) => {
  return await User.findById(userId).select("+password");
};

/**
 * Update user status (Active / Blocked)
 */
const updateUserStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(
    userId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -resetToken -resetTokenExpire");
};

/**
 * Create a new user
 */
const createUser = async (data) => {
  return await User.create(data);
};

module.exports = {
  getAllUsers,
  findUserByEmail,
  findByEmail,
  findById,
  findByIdWithPassword, 
  updateUserStatus,
  createUser,
};