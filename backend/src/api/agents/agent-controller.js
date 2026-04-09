const authService = require("../auth/auth-service");
const agentService = require("./agent-service");
const asyncHandler = require("../../utils/asyncHandler");

/* =========================================================
   🧑‍💼 REGISTER AGENT
========================================================= */

/**
 * @route POST /api/v1/auth/register/agent
 */
const registerAgent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    agencyName,
    licenseNumber,
    subscriptionPlan,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  const agent = await authService.registerAgent({
    name,
    email,
    phone,
    password,
    agencyName,
    licenseNumber,
    subscriptionPlan,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return res.status(201).json({
    success: true,
    message: "Agent registered successfully. Pending approval.",
    data: agent,
  });
});

/* =========================================================
   👤 AGENT PROFILE
========================================================= */

/**
 * 🧑‍💼 Get logged-in agent profile
 * @route GET /api/v1/agent/me
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const agent = await agentService.getMyAgentProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: agent,
  });
});

/* =========================================================
   🏠 PROPERTIES
========================================================= */

/**
 * 🏠 Get assigned properties
 * @route GET /api/v1/agent/properties
 */
const getAssignedProperties = asyncHandler(async (req, res) => {
  const properties =
    await agentService.getAssignedProperties(req.user.id);

  res.status(200).json({
    success: true,
    results: properties.length,
    data: properties,
  });
});

/**
 * ✅ Approve property
 * @route PATCH /api/v1/agent/properties/:propertyId/approve
 */
const approveProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const property = await agentService.approveProperty(
    propertyId,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Property approved successfully",
    data: property,
  });
});

/**
 * ❌ Reject property
 * @route PATCH /api/v1/agent/properties/:propertyId/reject
 */
const rejectProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { reason } = req.body;

  const property = await agentService.rejectProperty(
    propertyId,
    req.user.id,
    reason
  );

  res.status(200).json({
    success: true,
    message: "Property rejected successfully",
    data: property,
  });
});

/**
 * ❌ Get rejected properties
 * @route GET /api/v1/agent/properties/rejected
 */
const getRejectedProperties = asyncHandler(async (req, res) => {
  const properties =
    await agentService.getRejectedProperties(req.user.id);

  res.status(200).json({
    success: true,
    results: properties.length,
    data: properties,
  });
});

module.exports = {
  registerAgent,
  getMyProfile,
  getAssignedProperties,
  approveProperty,
  rejectProperty,
  getRejectedProperties,
};