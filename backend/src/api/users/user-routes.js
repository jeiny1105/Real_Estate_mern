const express = require("express");
const router = express.Router();

const { getMyProfile } = require("./user-controller");
const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

/**
 * @desc   Admin-only test route
 * @route  GET /api/v1/users/admin-test
 * @access Admin only
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
 * Protected route example
 */
router.get("/me", authenticate, getMyProfile);

module.exports = router;
