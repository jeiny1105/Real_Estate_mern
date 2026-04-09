const agentRepository = require("./agent-repository");
const AppError = require("../../utils/app-error");

/* =========================================================
   👤 AGENT PROFILE
========================================================= */

/**
 * 🧑‍💼 Get logged-in agent profile
 */
const getMyAgentProfile = async (userId) => {
  const agent = await agentRepository.getMyAgentProfile(userId);

  return agent;
};

/* =========================================================
   🏠 PROPERTIES
========================================================= */

/**
 * 🏠 Get properties assigned to agent
 */
const getAssignedProperties = async (agentUserId) => {
  if (!agentUserId) {
    throw new AppError("Agent user ID is required", 400);
  }

  const properties =
    await agentRepository.findAssignedProperties(agentUserId);

  return properties;
};

/**
 * ✅ Approve property
 */
const approveProperty = async (propertyId, agentUserId) => {
  if (!propertyId) {
    throw new AppError("Property ID is required", 400);
  }

  const property =
    await agentRepository.approveProperty(propertyId, agentUserId);

  return property;
};

/**
 * ❌ Reject property
 */
const rejectProperty = async (propertyId, agentUserId, reason) => {
  if (!propertyId) {
    throw new AppError("Property ID is required", 400);
  }

  const property =
    await agentRepository.rejectProperty(propertyId, agentUserId, reason);

  return property;
};

/**
 * ❌ Get rejected properties
 */
const getRejectedProperties = async (agentUserId) => {
  if (!agentUserId) {
    throw new AppError("Agent user ID is required", 400);
  }

  const properties =
    await agentRepository.findRejectedProperties(agentUserId);

  return properties;
};

module.exports = {
  getMyAgentProfile, 
  getAssignedProperties,
  approveProperty,
  rejectProperty,
  getRejectedProperties,
};