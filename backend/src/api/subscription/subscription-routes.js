const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

const PERMISSIONS = require("../../config/permissions");

const subscriptionController = require("./subscription-controller");

/* 🔹 Validation */
const {
  initiateUpgradeSchema,
  verifyUpgradeSchema,
  emptySchema,
} = require("../../validations/subscription-validation");

/* 🔐 Protect all routes */
router.use(authenticate);

/**
 * Initiate Upgrade
 */
router.post(
  "/upgrade",
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  validateRequest(initiateUpgradeSchema),
  subscriptionController.initiateUpgrade
);

/**
 * Verify Upgrade Payment
 */
router.post(
  "/upgrade/verify",
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  validateRequest(verifyUpgradeSchema),
  subscriptionController.verifyUpgradePayment
);

/**
 * Enable Auto-Renew
 */
router.post(
  "/auto-renew/enable",
  validateRequest(emptySchema),
  subscriptionController.enableAutoRenew
);

/**
 * Cancel Subscription
 */
router.post(
  "/cancel",
  validateRequest(emptySchema),
  subscriptionController.cancelSubscription
);

module.exports = router;