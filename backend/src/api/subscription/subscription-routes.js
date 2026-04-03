const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

const subscriptionController = require("./subscription-controller");

// Protect all subscription routes
router.use(authenticate);

/**
 * Initiate Upgrade
 * POST /api/v1/subscription/upgrade
 */
router.post(
  "/upgrade",
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  subscriptionController.initiateUpgrade
);

/**
 * Verify Upgrade Payment
 * POST /api/v1/subscription/upgrade/verify
 */
router.post(
  "/upgrade/verify",
  authorizePermission(PERMISSIONS.PAYMENTS_CREATE),
  subscriptionController.verifyUpgradePayment
);

/**
 * Enable Auto-Renew
 * POST /api/v1/subscription/auto-renew/enable
 */
router.post(
  "/auto-renew/enable",
  subscriptionController.enableAutoRenew
);

/**
 * Cancel Subscription
 * POST /api/v1/subscription/cancel
 */
router.post(
  "/cancel",
  subscriptionController.cancelSubscription
);

module.exports = router;