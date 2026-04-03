const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

const controller = require("./subscriptionPlan-controller");

/* =====================================================
   🔓 SELLER  DASHBOARD ROUTE
===================================================== */

// Get plans available for logged-in user role
router.get(
  "/available",
  authenticate,
  controller.getAvailablePlans
);

/* =====================================================
   🔐 ADMIN ROUTES (Protected)
===================================================== */

router.use(authenticate);

// Read plans
router.get(
  "/",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_READ),
  controller.getPlans
);

router.get(
  "/active",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_READ),
  controller.getActivePlans
);

router.get(
  "/:id",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_READ),
  controller.getPlanById
);

// Manage plans
router.post(
  "/",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_CREATE),
  controller.createPlan
);

router.put(
  "/:id",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_UPDATE),
  controller.updatePlan
);

router.delete(
  "/:id",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_CANCEL),
  controller.deletePlan
);

router.patch(
  "/:id/toggle-status",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_UPDATE),
  controller.togglePlanStatus
);

module.exports = router;