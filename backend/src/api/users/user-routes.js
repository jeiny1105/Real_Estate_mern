const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("./user-controller");

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

const PERMISSIONS = require("../../config/permissions");

const {
  updateProfileSchema,
} = require("../../validations/user-validation");

/**
 * Admin test
 */
router.get(
  "/admin-test",
  authenticate,
  authorizePermission(PERMISSIONS.USERS_READ),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin 👑",
    });
  }
);

/**
 * Get profile
 */
router.get("/me", authenticate, getMyProfile);

/**
 * ✅ CLEAN UPDATE PROFILE
 */
router.patch(
  "/me",
  authenticate,
  validateRequest(updateProfileSchema),
  updateMyProfile
);

module.exports = router;