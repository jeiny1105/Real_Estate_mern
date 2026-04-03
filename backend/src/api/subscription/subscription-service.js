const User = require("../models/user-model");
const SubscriptionPlan = require("../models/subscriptionPlan-model");
const prorationCalculator = require("../../utils/proration-calculator");
const AppError = require("../../utils/app-error");

/* Activate Initial Subscription */
const activateSubscription = async (userId, planId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // Block if already active
  if (
    user.subscription.status === "Active" &&
    user.subscription.expiryDate &&
    user.subscription.expiryDate > new Date()
  ) {
    throw new AppError(
      "You already have an active subscription. Please upgrade instead.",
      400
    );
  }

  const plan = await SubscriptionPlan.findOne({
    _id: planId,
    status: "Active",
    isDeleted: false,
  });

  if (!plan) {
    throw new AppError("Subscription plan not found or inactive", 404);
  }

  // Calculate dates
  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(
    startDate.getDate() + plan.pricing.durationInDays
  );

  // Build snapshot (frozen contract)
  const snapshot = {
    name: plan.name,
    planFor: plan.planFor,

    price: plan.pricing.price,
    durationInDays: plan.pricing.durationInDays,

    limits: {
      maxListings: plan.limits.maxListings,
      activeListingDays: plan.limits.activeListingDays,
      maxFeaturedListings: plan.limits.maxFeaturedListings,
      maxLeads: plan.limits.maxLeads,
    },

    features: {
      featuredListings: plan.features.featuredListings,
      canEditListings: plan.features.canEditListings,
      canDeleteListings: plan.features.canDeleteListings,
      prioritySupport: plan.features.prioritySupport,
      aiRecommendations: plan.features.aiRecommendations,
      analyticsDashboard: plan.features.analyticsDashboard,
      crmAccess: plan.features.crmAccess,
      notifications: plan.features.notifications,
    },
  };

  // Activate subscription
  user.subscription = {
    plan: plan._id,
    status: "Active",
    startDate,
    expiryDate,
    autoRenew: false,
    snapshot,
  };

  await user.save();

  return {
    message: "Subscription activated successfully",
    startDate,
    expiryDate,
  };
};

/* Initiate Upgrade */
const initiateUpgrade = async (userId, newPlanId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (
    user.subscription.status !== "Active" ||
    !user.subscription.snapshot ||
    !user.subscription.expiryDate ||
    user.subscription.expiryDate < new Date()
  ) {
    throw new AppError("No active subscription to upgrade", 400);
  }

  const newPlan = await SubscriptionPlan.findOne({
    _id: newPlanId,
    status: "Active",
    isDeleted: false,
  });

  if (!newPlan) {
    throw new AppError("New subscription plan not found", 404);
  }

  const currentSnapshot = user.subscription.snapshot;

  if (newPlan.pricing.price <= currentSnapshot.price) {
    throw new AppError(
      "Upgrade allowed only to higher priced plans",
      400
    );
  }

  const proration = prorationCalculator.calculateUpgradeAmount({
    startDate: user.subscription.startDate,
    expiryDate: user.subscription.expiryDate,
    currentPrice: currentSnapshot.price,
    currentDuration: currentSnapshot.durationInDays,
    newPrice: newPlan.pricing.price,
  });

  return {
    currentPlan: currentSnapshot.name,
    newPlan: newPlan.name,
    remainingDays: proration.remainingDays,
    remainingValue: proration.remainingValue,
    payableAmount: proration.payableAmount,
  };
};

/* Complete Upgrade After Payment */
const completeUpgrade = async (userId, newPlanId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const newPlan = await SubscriptionPlan.findOne({
    _id: newPlanId,
    status: "Active",
    isDeleted: false,
  });

  if (!newPlan) {
    throw new AppError("New subscription plan not found", 404);
  }

  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(
    startDate.getDate() + newPlan.pricing.durationInDays
  );

  const snapshot = {
    name: newPlan.name,
    planFor: newPlan.planFor,
    price: newPlan.pricing.price,
    durationInDays: newPlan.pricing.durationInDays,
    limits: newPlan.limits,
    features: newPlan.features,
  };

  user.subscription = {
    plan: newPlan._id,
    status: "Active",
    startDate,
    expiryDate,
    autoRenew: false,
    snapshot,
  };

  await user.save();

  return {
    message: "Subscription upgraded successfully",
    startDate,
    expiryDate,
  };
};

/* Cancel Subscription (turn off auto renew) */
const cancelSubscription = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (
    user.subscription.status !== "Active" ||
    !user.subscription.expiryDate ||
    user.subscription.expiryDate < new Date()
  ) {
    throw new AppError("No active subscription to cancel", 400);
  }

  user.subscription.autoRenew = false;

  await user.save();

  return {
    message: "Subscription will remain active until expiry but will not renew",
    expiryDate: user.subscription.expiryDate,
  };
};

/* Enable Auto Renew */
const enableAutoRenew = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (
    user.subscription.status !== "Active" ||
    !user.subscription.expiryDate ||
    user.subscription.expiryDate < new Date()
  ) {
    throw new AppError("No active subscription found", 400);
  }

  user.subscription.autoRenew = true;

  await user.save();

  return {
    message: "Auto-renew enabled successfully",
    expiryDate: user.subscription.expiryDate,
  };
};

module.exports = {
  activateSubscription,
  initiateUpgrade,
  completeUpgrade,
  cancelSubscription,
  enableAutoRenew,
};