const express = require("express");
const router = express.Router();

const authenticate = require("../../middlewares/auth-middleware");
const agentController = require("./agent-controller");

/* =========================================================
   🔐 AUTH REQUIRED FOR ALL AGENT ROUTES
========================================================= */

router.use(authenticate);

/* =========================================================
   🧑‍💼 AGENT ROUTES
========================================================= */

// Get all properties assigned to this agent
router.get("/properties", agentController.getAssignedProperties);

// Get rejected properties
router.get("/properties/rejected", agentController.getRejectedProperties);

// Approve a property
router.patch("/properties/:propertyId/approve",agentController.approveProperty);

// Reject a property
router.patch("/properties/:propertyId/reject", agentController.rejectProperty);

module.exports = router;