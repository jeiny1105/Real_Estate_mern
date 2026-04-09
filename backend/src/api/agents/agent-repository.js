const Agent = require("../models/agent-model");
const Property = require("../models/property-model");
const AppError = require("../../utils/app-error");

/* =========================================================
   🧑‍💼 CREATE / FIND
========================================================= */

/* Create agent */
const createAgent = async (data) => {
  return await Agent.create(data);
};

/* Find by license */
const findByLicenseNumber = async (licenseNumber) => {
  return await Agent.findOne({ licenseNumber });
};

/* Find by user */
const findAgentByUserId = async (userId) => {
  return await Agent.findOne({ user: userId });
};

/* 🔥 NEW: Get agent profile (for /agents/me) */
const getMyAgentProfile = async (userId) => {
  const agent = await Agent.findOne({ user: userId });

  if (!agent) {
    throw new AppError("Agent profile not found", 404);
  }

  return agent;
};

/* =========================================================
   🛠 ADMIN
========================================================= */

/* Get all agents */
const getAllAgents = async () => {
  return await Agent.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
};

/* Update agent status */
const updateAgentStatus = async (agentId, status) => {
  const agent = await Agent.findByIdAndUpdate(
    agentId,
    { status },
    { new: true }
  );

  if (!agent) {
    throw new AppError("Agent not found", 404);
  }

  return agent;
};

/* =========================================================
   🏠 PROPERTIES
========================================================= */

/* Get assigned properties */
const findAssignedProperties = async (agentUserId) => {
  return await Property.find({
    agent: agentUserId,
    isDeleted: false,
  })
    .populate("seller", "name")
    .sort({ createdAt: -1 });
};

/* Approve property */
const approveProperty = async (propertyId, agentUserId) => {
  const property = await Property.findOneAndUpdate(
    {
      _id: propertyId,
      agent: agentUserId,
      isDeleted: false,
    },
    {
      agentDecision: "Approved",
    },
    { new: true }
  );

  if (!property) {
    throw new AppError("Property not found or not assigned to this agent", 404);
  }

  return property;
};

/* Reject property */
const rejectProperty = async (propertyId, agentUserId, reason) => {
  const property = await Property.findOneAndUpdate(
    {
      _id: propertyId,
      agent: agentUserId,
      isDeleted: false,
    },
    {
      agentDecision: "Rejected",
      agentRejectReason: reason || null,
    },
    { new: true }
  );

  if (!property) {
    throw new AppError("Property not found or not assigned to this agent", 404);
  }

  return property;
};

/* Get rejected properties */
const findRejectedProperties = async (agentUserId) => {
  return await Property.find({
    agent: agentUserId,
    agentDecision: "Rejected",
    isDeleted: false,
  })
    .populate("seller", "name")
    .sort({ updatedAt: -1 });
};

module.exports = {
  createAgent,
  findByLicenseNumber,
  findAgentByUserId,
  getMyAgentProfile, 
  getAllAgents,
  updateAgentStatus,
  findAssignedProperties,
  approveProperty,
  rejectProperty,
  findRejectedProperties,
};