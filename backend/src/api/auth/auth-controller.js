const authService = require("./auth-service");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * @desc   Register Buyer (no payment)
 * @route  POST /api/v1/auth/register
 * @access Public
 */
const registerBuyer = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    profileImage,
    role,
  } = req.body;

  /* 1️⃣ Force Buyer role */
  if (role && role !== "Buyer") {
    throw new AppError(
      "Invalid role for this registration flow",
      400
    );
  }

  /* 2️⃣ Required field validation */
  if (!name || !email || !phone || !password) {
    throw new AppError(
      "All required fields must be provided",
      400
    );
  }

  /* 3️⃣ Call service */
  const buyer = await authService.registerBuyer({
    name,
    email,
    phone,
    password,
    profileImage,
  });

  /* 4️⃣ Response */
  res.status(201).json({
    success: true,
    message: "Buyer registered successfully",
    data: buyer,
  });
});

/**
 * @desc    Login user (Buyer / Seller / Agent)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(
    email,
    password,
    {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    }
  );

  res.status(200).json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user,
  });
});

/**
 * ♻ Refresh access token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req.body.refreshToken ||
    req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 400);
  }

  const result =
    await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    accessToken: result.accessToken,
  });
});

/**
 * 🚪 Logout user
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken =
    req.body.refreshToken ||
    req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 400);
  }

  const result = await authService.logout(refreshToken);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  registerBuyer,
  login,
  refreshToken,
  logout,
};