const SubscriptionPlan = require("../models/subscriptionPlan-model");

// 🔹 Repository layer handles direct DB operations
const getAllPlans = async () => {
  try {
    return await SubscriptionPlan.find({ isDeleted: false }).sort({ createdAt: -1 });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPlanById = async (id) => {
  try {
    return await SubscriptionPlan.findOne({ _id: id, isDeleted: false });
  } catch (err) {
    throw new Error(err.message);
  }
};

const createPlan = async (data) => {
  try {
    return await SubscriptionPlan.create(data);
  } catch (err) {
    throw new Error(err.message);
  }
};

const updatePlan = async (id, data) => {
  try {
    return await SubscriptionPlan.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    throw new Error(err.message);
  }
};

const deletePlan = async (id) => {
  try {
    return await SubscriptionPlan.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  } catch (err) {
    throw new Error(err.message);
  }
};

const toggleStatus = async (id) => {
  try {
    const plan = await getPlanById(id);
    if (!plan) throw new Error("Plan not found");
    plan.status = plan.status === "Active" ? "Inactive" : "Active";
    return await plan.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

// 🔹 Get only active plans
const getActivePlans = async () => {
  try {
    return await SubscriptionPlan.find({ status: "Active", isDeleted: false }).sort({ createdAt: -1 });
  } catch (err) {
    throw new Error(err.message);
  }
};

//Get available plans by role
const getAvailablePlansByRole = async (role) => {
  try {
    return await SubscriptionPlan.find({
      status: "Active",
      isDeleted: false,
      $or: [
        { planFor: role },
        { planFor: "Both" }
      ]
    }).sort({ createdAt: -1 });
  } catch (err) {
    throw new Error(err.message);
  }
};


module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  toggleStatus,
  getActivePlans,
  getAvailablePlansByRole,
};
