const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

const agentController = require("./agent-controller");

/* 🔹 Validation */
const {
  propertyIdParamSchema,
  rejectPropertySchema,
} = require("../../validations/agent-validation");

/* 🔹 Permissions */
const PERMISSIONS = require("../../config/permissions");

/* =========================================================
   🔐 AUTH
========================================================= */

router.use(authenticate);

/* =========================================================
   👤 AGENT PROFILE
========================================================= */

// ✅ Requires at least read access
router.get(
  "/me",
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  agentController.getMyProfile
);

/* =========================================================
   🏠 PROPERTY MANAGEMENT
========================================================= */

// Get assigned properties
router.get(
  "/properties",
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  agentController.getAssignedProperties
);

// Get rejected properties
router.get(
  "/properties/rejected",
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  agentController.getRejectedProperties
);

// ✅ Approve property
router.patch(
  "/properties/:propertyId/approve",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  validateRequest(propertyIdParamSchema, "params"),
  agentController.approveProperty
);

// ❌ Reject property
router.patch(
  "/properties/:propertyId/reject",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  validateRequest(propertyIdParamSchema, "params"),
  validateRequest(rejectPropertySchema),
  agentController.rejectProperty
);

module.exports = router;