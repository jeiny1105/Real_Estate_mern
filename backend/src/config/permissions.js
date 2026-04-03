// src/config/permissions.js

const PERMISSIONS = {
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",

  PROPERTIES_CREATE: "properties:create",
  PROPERTIES_READ: "properties:read",
  PROPERTIES_UPDATE: "properties:update",
  PROPERTIES_DELETE: "properties:delete",

  SUBSCRIPTIONS_CREATE: "subscriptions:create",
  SUBSCRIPTIONS_READ: "subscriptions:read",
  SUBSCRIPTIONS_UPDATE: "subscriptions:update",
  SUBSCRIPTIONS_CANCEL: "subscriptions:cancel",

  PAYMENTS_CREATE: "payments:create",
  PAYMENTS_READ: "payments:read",
  PAYMENTS_REFUND: "payments:refund",
};

module.exports = PERMISSIONS;
