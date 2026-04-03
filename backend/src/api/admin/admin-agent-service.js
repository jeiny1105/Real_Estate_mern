const agentRepository = require("../agents/agent-repository");

/**
 * 🔹 Get all agents (Admin only)
 */
const getAllAgents = async () => {
  const agents = await agentRepository.getAllAgents();
  return agents;
};

/**
 *  Get Active Agents
 */
const getActiveAgents = async () => {

  const agents = await agentRepository.getAllAgents();

  return agents.filter(agent => agent.status === "Active");

};

/**
 * 🔹 Approve / Reject Agent
 */
const updateAgentStatus = async (agentId, status) => {
  const allowedStatuses = ["Active", "Rejected"];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid agent status");
    error.statusCode = 400;
    throw error;
  }

  const updatedAgent =
    await agentRepository.updateAgentStatus(agentId, status);

  if (!updatedAgent) {
    const error = new Error("Agent not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedAgent;
};

module.exports = {
  getAllAgents,
  getActiveAgents,
  updateAgentStatus,
};
