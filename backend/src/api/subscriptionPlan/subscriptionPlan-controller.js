const service = require("./subscriptionPlan-service");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * Get all plans
 */
const getPlans = asyncHandler(async (req, res) => {
  const plans = await service.fetchPlans();

  res.status(200).json({
    success: true,
    data: plans,
  });
});

/**
 * Get plan by ID
 */
const getPlanById = asyncHandler(async (req, res) => {
  const plan = await service.getPlan(req.params.id);

  res.status(200).json({
    success: true,
    data: plan,
  });
});

/**
 * Create plan
 */
const createPlan = asyncHandler(async (req, res) => {
  const newPlan = await service.addPlan(req.body);

  res.status(201).json({
    success: true,
    data: newPlan,
  });
});

/**
 * Update plan
 */
const updatePlan = asyncHandler(async (req, res) => {
  const updatedPlan = await service.editPlan(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    data: updatedPlan,
  });
});

/**
 * Delete plan
 */
const deletePlan = asyncHandler(async (req, res) => {
  await service.removePlan(req.params.id);

  res.status(200).json({
    success: true,
    message: "Plan deleted successfully",
  });
});

/**
 * Toggle plan status
 */
const togglePlanStatus = asyncHandler(async (req, res) => {
  const plan = await service.changeStatus(req.params.id);

  res.status(200).json({
    success: true,
    data: plan,
  });
});

/**
 * Get active plans
 */
const getActivePlans = asyncHandler(async (req, res) => {
  const plans = await service.fetchActivePlans();

  res.status(200).json({
    success: true,
    data: plans,
  });
});

/**
 * Get available plans (based on user role)
 */
const getAvailablePlans = asyncHandler(async (req, res) => {
  const role = req.user.role;

  const plans = await service.fetchAvailablePlansForRole(role);

  res.status(200).json({
    success: true,
    data: plans,
  });
});

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  getActivePlans,
  getAvailablePlans,
};