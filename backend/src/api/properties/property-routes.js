const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

const controller = require("./property-controller");
const upload = require("../../middlewares/upload-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

const {
  createPropertySchema,
  updatePropertySchema,
  idParamSchema,
} = require("../../validations/property-validation");

/* =========================================================
   🔹 PUBLIC ROUTES
========================================================= */

// Get all properties
router.get("/", controller.getProperties);

// Suggestions
router.get("/suggestions", controller.getSuggestions);

// Get single property (PUBLIC)
router.get(
  "/:id",
  validateRequest(idParamSchema, "params"),
  controller.getPropertyById
);

/* =========================================================
   🔐 SELLER ROUTES (AUTH + PERMISSIONS)
========================================================= */

// Get my properties
router.get(
  "/my",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  controller.getMyProperties
);

// Create property
router.post(
  "/",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_CREATE),
  upload.array("images", 5),
  validateRequest(createPropertySchema),
  controller.createProperty
);

// Update property
router.put(
  "/:id",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  validateRequest(idParamSchema, "params"),
  validateRequest(updatePropertySchema),
  controller.updateProperty
);

// Delete property
router.delete(
  "/:id",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_DELETE),
  validateRequest(idParamSchema, "params"),
  controller.deleteProperty
);

// Change listing status
router.patch(
  "/:id/status",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  validateRequest(idParamSchema, "params"),
  controller.updatePropertyStatus
);

/* =========================================================
   🛡 ADMIN ROUTES
========================================================= */

// Approve / Reject property
router.patch(
  "/:id/approval",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_APPROVE),
  validateRequest(idParamSchema, "params"),
  controller.updateApprovalStatus
);

// Toggle featured
router.patch(
  "/:id/feature",
  authenticate,
  authorizePermission(PERMISSIONS.PROPERTIES_FEATURE),
  validateRequest(idParamSchema, "params"),
  controller.toggleFeatured
);

module.exports = router;