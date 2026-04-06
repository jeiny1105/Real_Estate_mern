const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

const paymentController = require("./payment-controller");

const validateRequest = require("../../middlewares/validateRequest-middleware");

/* 🔥 IMPORT LIMITER */
const { paymentLimiter } = require("../../middlewares/rate-limit-middleware");

const {
  createOrderSchema,
  verifyPaymentSchema,
  paymentIdParamSchema,
} = require("../../validations/payment-validation");

/* 🔹 Razorpay webhook (NO AUTH) */
router.post("/webhook", paymentController.razorpayWebhook);

/* 🔹 Protect all routes below */
router.use(authenticate);

/**
 * Seller Razorpay order creation
 */
router.post(
  "/seller/create-order",
  paymentLimiter, // 🔥 ADD THIS
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  validateRequest(createOrderSchema),
  paymentController.createSellerOrder
);

/**
 * Agent Razorpay order creation
 */
router.post(
  "/agent/create-order",
  paymentLimiter, // 🔥 ADD THIS
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  validateRequest(createOrderSchema),
  paymentController.createAgentOrder
);

/**
 * Verify Razorpay payment
 */
router.post(
  "/verify",
  paymentLimiter, // 🔥 ADD THIS
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  validateRequest(verifyPaymentSchema),
  paymentController.verifyPayment
);

/**
 * Get current user's payment history
 */
router.get("/my", paymentController.getMyPayments);

/**
 * Download Invoice
 */
router.get(
  "/:paymentId/invoice",
  validateRequest(paymentIdParamSchema, "params"),
  paymentController.downloadInvoice
);

module.exports = router;