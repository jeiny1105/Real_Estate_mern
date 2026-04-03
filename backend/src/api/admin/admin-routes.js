const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

const adminController = require("./admin-controller");
const adminAgentController = require("./admin-agent-controller");

const propertyController = require("../properties/property-controller");

const subscriptionPlanRoutes = require("../subscriptionPlan/subscriptionPlan-routes");

// 🔐 Protect ALL admin routes with authentication
router.use(authenticate);

/* ===== USERS ===== */
router.get(
  "/users",
  authorizePermission(PERMISSIONS.USERS_READ),
  adminController.getAllUsers
);

router.patch(
  "/users/:userId/status",
  authorizePermission(PERMISSIONS.USERS_UPDATE),
  adminController.updateUserStatus
);

/* ===== AGENTS ===== */
router.get(
  "/agents",
  authorizePermission(PERMISSIONS.USERS_READ),
  adminAgentController.getAllAgents
);

router.get(
  "/agents/active",
  authorizePermission(PERMISSIONS.USERS_READ),
  adminAgentController.getActiveAgents
);

router.patch(
  "/agents/:agentId/status",
  authorizePermission(PERMISSIONS.USERS_UPDATE),
  adminAgentController.updateAgentStatus
);

/* ===== PROPERTIES ===== */

router.get(
  "/properties/pending",
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  propertyController.getPendingProperties
);

router.get(
  "/properties",
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  propertyController.getAssignedProperties
);

router.patch(
  "/properties/:id/approval",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  propertyController.updateApprovalStatus
);

router.patch(
  "/properties/:id/assign-agent",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  propertyController.assignAgent
);

router.patch(
  "/properties/:id/reassign-agent",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  propertyController.reassignAgent
);

router.use("/subscriptionPlans", subscriptionPlanRoutes);

module.exports = router;