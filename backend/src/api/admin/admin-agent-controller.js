const adminAgentService = require("./admin-agent-service");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * @desc   Get all agents (Admin)
 * @route  GET /api/v1/admin/agents
 * @access Admin
 */
const getAllAgents = asyncHandler(async (req, res) => {
  const agents = await adminAgentService.getAllAgents();

  return res.status(200).json({
    success: true,
    data: agents,
  });
});

/**
 *  GET Active Agents
 */
const getActiveAgents = asyncHandler(async (req, res) => {
  const agents = await adminAgentService.getActiveAgents();

  return res.status(200).json({
    success: true,
    data: agents,
  });
});

/**
 * @desc   Approve / Reject agent
 * @route  PATCH /api/v1/admin/agents/:agentId/status
 * @access Admin
 */
const updateAgentStatus = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const { status } = req.body;

  const updatedAgent =
    await adminAgentService.updateAgentStatus(agentId, status);

  return res.status(200).json({
    success: true,
    message: `Agent status updated to ${status}`,
    data: updatedAgent,
  });
});

module.exports = {
  getAllAgents,
  getActiveAgents,
  updateAgentStatus,
};