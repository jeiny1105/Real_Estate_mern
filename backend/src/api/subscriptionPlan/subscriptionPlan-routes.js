const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

const PERMISSIONS = require("../../config/permissions");

const controller = require("./subscriptionPlan-controller");

/* 🔹 Validation */
const {
  idParamSchema,
  createPlanSchema,
  updatePlanSchema,
} = require("../../validations/subscriptionPlan-validation");

/* =====================================================
   🔓 AVAILABLE PLANS (USER)
===================================================== */

router.get(
  "/available",
  authenticate,
  controller.getAvailablePlans
);

/* =====================================================
   🔐 ADMIN ROUTES
===================================================== */

router.use(authenticate);

/* 🔹 READ */
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
  validateRequest(idParamSchema, "params"),
  controller.getPlanById
);

/* 🔹 CREATE */
router.post(
  "/",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_CREATE),
  validateRequest(createPlanSchema),
  controller.createPlan
);

/* 🔹 UPDATE */
router.put(
  "/:id",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_UPDATE),
  validateRequest(idParamSchema, "params"),
  validateRequest(updatePlanSchema),
  controller.updatePlan
);

/* 🔹 DELETE */
router.delete(
  "/:id",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_CANCEL),
  validateRequest(idParamSchema, "params"),
  controller.deletePlan
);

/* 🔹 TOGGLE STATUS */
router.patch(
  "/:id/toggle-status",
  authorizePermission(PERMISSIONS.SUBSCRIPTIONS_UPDATE),
  validateRequest(idParamSchema, "params"),
  controller.togglePlanStatus
);

module.exports = router;