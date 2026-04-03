const Agent = require("../models/agent-model");
const Property = require("../models/property-model");

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

/* 🔹 Admin: Get all agents */
const getAllAgents = async () => {
  return await Agent.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
};

/* 🔹 Admin: Update agent status */
const updateAgentStatus = async (agentId, status) => {
  return await Agent.findByIdAndUpdate(
    agentId,
    { status },
    { new: true }
  );
};

/* Find properties assigned to agent */
const findAssignedProperties = async (agentUserId) => {
  return await Property.find({
    agent: agentUserId,
    isDeleted: false,
  })
    .populate("seller", "name")
    .sort({ createdAt: -1 });
};

/* ❌ Agent rejects property */
const rejectProperty = async (propertyId, agentUserId, reason) => {

  const property = await Property.findOneAndUpdate(
    {
      _id: propertyId,
      agent: agentUserId, // ensure property belongs to agent
      isDeleted: false,
    },
    {
      agentDecision: "Rejected",
      agentRejectReason: reason || null,
    },
    { new: true }
  );

  return property;
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

  return property;
};

/* 🔹 Get rejected properties for agent */
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
  getAllAgents,
  updateAgentStatus,
  findAssignedProperties,
  rejectProperty,
  approveProperty,
  findRejectedProperties,
};
