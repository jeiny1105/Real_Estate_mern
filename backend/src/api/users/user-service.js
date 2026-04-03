const bcrypt = require("bcryptjs");
const userRepo = require("./user-repository");

// ---------------- GET ME ----------------
const getMe = async (userId) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
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
  };
};

// ---------------- UPDATE PROFILE ----------------
const updateMe = async (userId, data, file) => {
  const user = await userRepo.findById(userId);

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

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (city) user.city = city;
  if (state) user.state = state;
  if (postalCode) user.postalCode = postalCode;

  // Password change
  if (currentPassword && newPassword && confirmPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      const err = new Error("Current password incorrect");
      err.statusCode = 401;
      throw err;
    }

    if (newPassword !== confirmPassword) {
      const err = new Error("New passwords do not match");
      err.statusCode = 400;
      throw err;
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  // Profile Image
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