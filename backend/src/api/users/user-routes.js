const express = require("express");
const router = express.Router();

const { getMyProfile, updateMyProfile } = require("./user-controller");

const authenticate = require("../../middlewares/auth-middleware");
const authorize = require("../../middlewares/permission-middleware");
const validate = require("../../middlewares/validateRequest-middleware");
const upload = require("../../middlewares/upload-middleware");

const PERMISSIONS = require("../../config/permissions");
const { updateProfileSchema } = require("../../validations/user-validation");

/* ================= ADMIN ================= */
router.get(
  "/admin-test",
  authenticate,
  authorize(PERMISSIONS.USERS_READ),
  (req, res) =>
    res.status(200).json({
      success: true,
      message: "Welcome Admin 👑",
    })
);

/* ================= PROFILE ================= */
router.get("/me", authenticate, getMyProfile);

router.patch(
  "/me",
  authenticate,
  upload.single("profileImage"), 
  validate(updateProfileSchema), 
  updateMyProfile
);

module.exports = router;