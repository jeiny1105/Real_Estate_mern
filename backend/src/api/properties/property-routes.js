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

// Get All Properties
router.get("/", controller.getProperties);
router.get("/suggestions", controller.getSuggestions);

/* =========================================================
   🔐 AUTH REQUIRED BELOW
========================================================= */

router.use(authenticate);

/* =========================================================
   🏠 SELLER ROUTES
========================================================= */

// 🔥 IMPORTANT: KEEP THIS ABOVE "/:id"
router.get(
  "/my",
  authorizePermission(PERMISSIONS.PROPERTIES_READ),
  controller.getMyProperties
);

// ✅ Create Property
router.post(
  "/",
  authorizePermission(PERMISSIONS.PROPERTIES_CREATE),
  upload.array("images", 5),
  validateRequest(createPropertySchema),
  controller.createProperty
);

// ✅ Update Property
router.put(
  "/:id",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  validateRequest(idParamSchema, "params"),
  validateRequest(updatePropertySchema),
  controller.updateProperty
);

// ✅ Soft Delete
router.delete(
  "/:id",
  authorizePermission(PERMISSIONS.PROPERTIES_DELETE),
  validateRequest(idParamSchema, "params"),
  controller.deleteProperty
);

// Change Listing Status
router.patch(
  "/:id/status",
  authorizePermission(PERMISSIONS.PROPERTIES_UPDATE),
  validateRequest(idParamSchema, "params"),
  controller.updatePropertyStatus
);

/* =========================================================
   🛡 ADMIN ROUTES
========================================================= */

// Approve / Reject
router.patch(
  "/:id/approval",
  authorizePermission(PERMISSIONS.PROPERTIES_APPROVE),
  validateRequest(idParamSchema, "params"),
  controller.updateApprovalStatus
);

// Featured
router.patch(
  "/:id/feature",
  authorizePermission(PERMISSIONS.PROPERTIES_FEATURE),
  validateRequest(idParamSchema, "params"),
  controller.toggleFeatured
);

/* =========================================================
   🔹 PUBLIC (KEEP LAST)
========================================================= */

// 🔥 ALWAYS LAST (VERY IMPORTANT)
router.get(
  "/:id",
  validateRequest(idParamSchema, "params"),
  controller.getPropertyById
);

module.exports = router;