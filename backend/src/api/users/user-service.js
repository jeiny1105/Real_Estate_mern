const bcrypt = require("bcryptjs");
const userRepo = require("./user-repository");

const Inquiry = require("../models/inquiry-model");
const Wishlist = require("../models/wishlist-model");

/* ================= GET ME ================= */
const getMe = async (userId) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  let stats = null;

  /* 🔥 BUYER STATS */
  if (user.role === "Buyer") {
    const inquiries = await Inquiry.countDocuments({ buyer: userId });

    const visits = await Inquiry.countDocuments({
      buyer: userId,
      status: "Visit Scheduled",
    });

    const wishlist = await Wishlist.countDocuments({ user: userId });

    stats = {
      inquiries,
      visits,
      wishlist,
    };
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImage: user.profileImage || null,
    subscription: user.subscription || null,
    stats, // ✅ ADD THIS
  };
};

/* ================= UPDATE PROFILE ================= */
const updateMe = async (userId, data, file) => {
  /* 🔥 IMPORTANT FIX: USE PASSWORD VERSION */
  const user = await userRepo.findByIdWithPassword(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const {
    name,
    email,
    phone,
    currentPassword,
    newPassword,
    confirmPassword,
    address,
    city,
    state,
    postalCode,
  } = data;

  /* 🔹 BASIC FIELDS */
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (city) user.city = city;
  if (state) user.state = state;
  if (postalCode) user.postalCode = postalCode;

  /* 🔥 SAFE PASSWORD CHANGE */
  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      const err = new Error("All password fields are required");
      err.statusCode = 400;
      throw err;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      const err = new Error("Current password incorrect");
      err.statusCode = 401;
      throw err;
    }

    if (newPassword !== confirmPassword) {
      const err = new Error("Passwords do not match");
      err.statusCode = 400;
      throw err;
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  /* 🔹 PROFILE IMAGE */
  if (file) {
    user.profileImage = `/uploads/${file.filename}`;
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImage: user.profileImage || null,
    subscription: user.subscription || null,
  };
};

module.exports = {
  getMe,
  updateMe,
};