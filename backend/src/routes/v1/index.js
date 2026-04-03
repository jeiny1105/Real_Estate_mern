const express = require("express");
const router = express.Router();

// Public routes

// Auth routes
router.use("/auth", require("../../api/auth/auth-routes"));

// Users
router.use("/users", require("../../api/users/user-routes"));

// Payments
router.use("/payments", require("../../api/payments/payment-routes"));

// Admin 
router.use("/admin", require("../../api/admin/admin-routes"));

// Seller
router.use("/sellers", require("../../api/sellers/seller-routes"));

// Agent
router.use("/agent", require("../../api/agents/agent-routes"));

//Property
router.use("/properties", require("../../api/properties/property-routes"));

//Subscription plan
router.use("/subscriptionPlans", require("../../api/subscriptionPlan/subscriptionPlan-routes"));

//Subscription for Seller/Agent
router.use("/subscription", require("../../api/subscription/subscription-routes"));

//Inquiries
router.use("/inquiries", require("../../api/inquiry/inquiry-routes"));

router.use("/utils", require("../test-email"));

// Wishlist
router.use("/wishlist", require("../../api/wishlist/wishlist-routes"));

module.exports = router;
