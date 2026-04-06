const express = require("express");
const router = express.Router();

const {
  registerBuyer,
  login,
  refreshToken,
  logout,
} = require("./auth-controller");

const { registerSeller } = require("../sellers/seller-controller");
const { registerAgent } = require("../agents/agent-controller");

const validateRequest = require("../../middlewares/validateRequest-middleware");

const {
  registerBuyerSchema,
  registerSellerSchema,
  registerAgentSchema,
  loginSchema,
} = require("../../validations/auth-validation");

/* 🔥 IMPORT RATE LIMITER */
const { authLimiter } = require("../../middlewares/rate-limit-middleware");

/** Buyer registration */
router.post(
  "/register",
  validateRequest(registerBuyerSchema),
  registerBuyer
);

/** Seller Registration */
router.post(
  "/register/seller",
  validateRequest(registerSellerSchema),
  registerSeller
);

/** Agent Registration */
router.post(
  "/register/agent",
  validateRequest(registerAgentSchema),
  registerAgent
);

/** 🔐 Login (PROTECTED AGAINST BRUTE FORCE) */
router.post(
  "/login",
  authLimiter, // 🔥 VERY IMPORTANT
  validateRequest(loginSchema),
  login
);

/** Refresh Token */
router.post("/refresh", refreshToken);

/** Logout */
router.post("/logout", logout);

module.exports = router;