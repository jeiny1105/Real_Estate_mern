const repository = require("./subscriptionPlan-repository");

// 🔹 Service layer handles business logic
const fetchPlans = async () => {
  try {
    return await repository.getAllPlans();
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPlan = async (id) => {
  try {
    const plan = await repository.getPlanById(id);
    if (!plan) throw new Error("Plan not found");
    return plan;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addPlan = async (data) => {
  try {
    return await repository.createPlan(data);
  } catch (err) {
    throw new Error(err.message);
  }
};

const editPlan = async (id, data) => {
  try {
    const updatedPlan = await repository.updatePlan(id, data);
    if (!updatedPlan) throw new Error("Plan not found");
    return updatedPlan;
  } catch (err) {
    throw new Error(err.message);
  }
};

const removePlan = async (id) => {
  try {
    const deletedPlan = await repository.deletePlan(id);
    if (!deletedPlan) throw new Error("Plan not found");
    return deletedPlan;
  } catch (err) {
    throw new Error(err.message);
  }
};

const changeStatus = async (id) => {
  try {
    return await repository.toggleStatus(id);
  } catch (err) {
    throw new Error(err.message);
  }
};

const fetchActivePlans = async () => {
  return repository.getActivePlans();
};

const fetchAvailablePlansForRole = async (role) => {
  return repository.getAvailablePlansByRole(role);
};

module.exports = {
  fetchPlans,
  getPlan,
  addPlan,
  editPlan,
  removePlan,
  changeStatus,
  fetchActivePlans,
  fetchAvailablePlansForRole,
};
