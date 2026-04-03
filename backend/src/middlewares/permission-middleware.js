const ROLE_PERMISSIONS = require("../config/role-permissions");

/**
 * Permission-based authorization middleware
 * @param {string} requiredPermission
 */
const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const userRole = req.user.role;
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permission",
      });
    }

    next();
  };
};

module.exports = authorizePermission;
