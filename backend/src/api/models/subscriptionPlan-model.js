const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    /* 🔹 Basic Plan Info */
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* 🔹 Plan Type: Seller, Agent, or Both */
    planFor: {
      type: String,
      enum: ["Seller", "Agent", "Both"],  // updated to allow Both
      required: true,
      default: "Seller",
      index: true,
    },

    /* 🔹 Pricing & Duration */
    pricing: {
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      durationInDays: {
        type: Number,
        required: true,
        min: 1,
      },
    },

    /* 🔹 Limits */
    limits: {
      maxListings: {
        type: Number,
        min: 0,
        default: 5,
      },
      activeListingDays: {
        type: Number,
        min: 1,
        default: 30,
      },
      maxFeaturedListings: {
        type: Number,
        min: 0,
        default: 0,
      },
      maxLeads: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    /* 🔹 Feature Flags */
    features: {
      featuredListings: { type: Boolean, default: false },
      canEditListings: { type: Boolean, default: true },
      canDeleteListings: { type: Boolean, default: true },
      prioritySupport: { type: Boolean, default: false },
      aiRecommendations: { type: Boolean, default: false },
      analyticsDashboard: { type: Boolean, default: false },
      crmAccess: { type: Boolean, default: false },
      notifications: { type: Boolean, default: false },
    },

    /* 🔹 Plan Visibility & Lifecycle */
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
