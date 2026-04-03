const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* 🔹 Basic Details */
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      index: true
    },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    profileImage: { type: String, default: null },

    /* 🔹 Authentication */
    password: { type: String, required: true, minlength: 6, select: false },
    resetToken: String,
    resetTokenExpire: Date,

    /* 🔹 Role & Access */
    role: { type: String, enum: ["Admin", "Seller", "Buyer", "Agent"], default: "Buyer", index: true },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },

    /* 🔹 Multi-Tenant (Future Ready) */
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", default: null },

    /* 🔹 Quick reference to current subscription (optional) */
    subscription: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", default: null },
      status: { type: String, enum: ["Active", "Pending", "Expired", "Inactive"], default: "Pending" },
      startDate: Date,
      expiryDate: Date,
      autoRenew: { type: Boolean, default: false },
      snapshot: {
        name: String,
        planFor: String,

        price: Number,
        durationInDays: Number,

        limits: {
          maxListings: Number,
          activeListingDays: Number,
          maxFeaturedListings: Number,
          maxLeads: Number
        },

        features: {
          featuredListings: Boolean,
          canEditListings: Boolean,
          canDeleteListings: Boolean,
          prioritySupport: Boolean,
          aiRecommendations: Boolean,
          analyticsDashboard: Boolean,
          crmAccess: Boolean,
          notifications: Boolean
        }
      }
    },


    /* 🔹 Soft Deletes */
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
