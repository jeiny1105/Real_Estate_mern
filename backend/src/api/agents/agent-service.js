const agentRepository = require("./agent-repository");

/**
 * 🏠 Get properties assigned to agent
 */
const getAssignedProperties = async (agentUserId) => {

  const properties =
    await agentRepository.findAssignedProperties(agentUserId);

  return properties;
};

/**
 *  Approve property 
 */
const approveProperty = async (propertyId, agentUserId) => {

  const property =
    await agentRepository.approveProperty(propertyId, agentUserId);

  return property;
};

/**
 * ❌ Agent rejects assigned property
 */
const rejectProperty = async (propertyId, agentUserId, reason) => {

  const property =
    await agentRepository.rejectProperty(propertyId, agentUserId, reason);

  return property;
};

/**
 * ❌ Get rejected properties for agent
 */
const getRejectedProperties = async (agentUserId) => {

  const properties =
    await agentRepository.findRejectedProperties(agentUserId);

  return properties;
};

module.exports = {
  getAssignedProperties,
  approveProperty,
  rejectProperty,
  getRejectedProperties,
};