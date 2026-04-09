const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorize = require("../../middlewares/permission-middleware");
const validate = require("../../middlewares/validateRequest-middleware");
const upload = require("../../middlewares/upload-middleware");

const PERMISSIONS = require("../../config/permissions");
const controller = require("./property-controller");

const {
  createPropertySchema,
  updatePropertySchema,
  idParamSchema,
} = require("../../validations/property-validation");

/* 🔐 SELLER ROUTES (place BEFORE :id) */

router.get("/my", authenticate, authorize(PERMISSIONS.PROPERTIES_READ), controller.getMyProperties);

router.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.PROPERTIES_CREATE),
  upload.array("images", 5),
  validate(createPropertySchema),
  controller.createProperty
);

router.put(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.PROPERTIES_UPDATE),
  validate(idParamSchema, "params"),
  validate(updatePropertySchema),
  controller.updateProperty
);

router.delete(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.PROPERTIES_DELETE),
  validate(idParamSchema, "params"),
  controller.deleteProperty
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(PERMISSIONS.PROPERTIES_UPDATE),
  validate(idParamSchema, "params"),
  controller.updatePropertyStatus
);

/* 🛡 ADMIN */

router.patch(
  "/:id/approval",
  authenticate,
  authorize(PERMISSIONS.PROPERTIES_APPROVE),
  validate(idParamSchema, "params"),
  controller.updateApprovalStatus
);

router.patch(
  "/:id/feature",
  authenticate,
  authorize(PERMISSIONS.PROPERTIES_FEATURE),
  validate(idParamSchema, "params"),
  controller.toggleFeatured
);

/* 🌍 PUBLIC */

router.get("/", controller.getProperties);
router.get("/suggestions", controller.getSuggestions);

router.get(
  "/:id",
  validate(idParamSchema, "params"),
  controller.getPropertyById
);

module.exports = router;