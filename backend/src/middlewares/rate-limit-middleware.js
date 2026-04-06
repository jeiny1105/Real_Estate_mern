const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

/* GENERAL API LIMIT */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

/* AUTH BRUTE FORCE PROTECTION */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes."
  }
});

/* SLOW DOWN ATTACKERS */

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500
});

/* OTP LIMITER */

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: "Too many OTP requests. Please try later."
  }
});

/* 💰 PAYMENT LIMITER */
const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 20,
  message: {
    success: false,
    message: "Too many payment requests. Please try later.",
  },
});

/* INQUIRY LIMITER */

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many inquiries sent. Try again later."
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  speedLimiter,
  otpLimiter,
  paymentLimiter,
  inquiryLimiter
};