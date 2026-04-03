const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../users/user-repository");
const sellerRepository = require("../sellers/seller-repository");
const agentRepository = require("../agents/agent-repository");
const paymentService = require("../payments/payment-service");
const AppError = require("../../utils/app-error");
const RefreshToken = require("../models/refreshToken-model");
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require("../../utils/token-utils");

/**
 * 👤 Register Buyer (no payment)
 */
const registerBuyer = async ({
  name,
  email,
  phone,
  password,
  profileImage,
}) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    profileImage: profileImage || null,
    role: "Buyer",
    status: "Active",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

/**
 * 🏢 Register Seller (after successful payment)
 */
const registerSeller = async (data) => {
  const {
    name,
    email,
    phone,
    password,
    companyName,
    gstNumber,
  } = data;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role: "Seller",
    status: "Active",
  });

  const seller = await sellerRepository.createSeller({
    user: user._id,
    companyName,
    gstNumber: gstNumber || null,
    status: "Active",
  });

  return {
    id: seller._id,
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    sellerStatus: seller.status,
  };
};

/**
 * 🧑‍💼 Register Agent (after successful payment)
 */
const registerAgent = async (data) => {
  const {
    name,
    email,
    phone,
    password,
    agencyName,
    licenseNumber,
    subscriptionPlan,
  } = data;

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const existingAgent =
    await agentRepository.findByLicenseNumber(licenseNumber);
  if (existingAgent) {
    throw new AppError(
      "License number already registered",
      400
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role: "Agent",
    status: "Active",
  });

  const agent = await agentRepository.createAgent({
    user: user._id,
    agencyName,
    licenseNumber,
    status: "Inactive",
  });

  return {
    id: agent._id,
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    agentStatus: agent.status,
  };
};


/**
 * 🔐 Login service (Access + Refresh Token)
 */
const login = async (email, password, reqMeta = {}) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status === "Blocked") {
    throw new AppError("Your account has been blocked", 403);
  }

  // 🔒 Agent-specific checks
  if (user.role === "Agent") {
    const agent = await agentRepository.findAgentByUserId(
      user._id
    );

    if (!agent) {
      throw new AppError("Agent profile not found", 404);
    }

    if (agent.status !== "Active") {
      throw new AppError(
        "Your agent account is pending admin approval",
        401
      );
    }
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // 1. Generate access token (short-lived)
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  // 2. Generate refresh token (long-lived)
  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  // 3. Store refresh token in DB
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
    createdByIp: reqMeta.ip,
    userAgent: reqMeta.userAgent,
  });

  return {
  accessToken,
  refreshToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    subscription: user.subscription || null, 
  },
};
};

/**
 * ♻ Refresh Access Token
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }

  // ✅ IMPORTANT: sanitize token
  const cleanToken = refreshToken.trim();

  // 1. Verify refresh token JWT
  let decoded;
  try {
    decoded = verifyRefreshToken(cleanToken);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // 2. Check token exists in DB (session valid)
  const storedToken = await RefreshToken.findOne({
    token: cleanToken,
    user: decoded.userId,
  });

  if (!storedToken) {
    throw new AppError("Refresh token revoked", 401);
  }

  // 3. Issue new access token
  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
    role: decoded.role, // role may be undefined for now (OK)
  });

  return {
    accessToken: newAccessToken,
  };
};



/**
 * 🚪 Logout (invalidate refresh token)
 */
const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token required", 400);
  }

  const deleted = await RefreshToken.findOneAndDelete({
    token: refreshToken.trim(),
  });

  // Even if token is already gone, logout should succeed
  return {
    success: true,
    message: "Logged out successfully",
  };
};


module.exports = {
  registerBuyer,
  registerSeller,
  registerAgent,
  login,
  refreshAccessToken,
  logout,
};
