const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    /* 🔹 User making the payment */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 🔹 User role (Seller or Agent) */
    userRole: {
      type: String,
      enum: ["Seller", "Agent"],
      required: true,
      index: true,
    },

    //Type of payment(initial or upgraded)
    type: {
      type: String,
      enum: ["Initial", "Upgrade", "Renewal"],
      required: true,
      default: "Initial",
      index: true
    },

    /* 🔹 Purchased Plan */
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
      index: true,
    },

    /* 🔹 Payment details */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    gateway: {
      type: String,
      enum: ["Razorpay", "Stripe", "UPI", "Card"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "UPI", "NetBanking", "Wallet"],
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },

    /* 🔹 Invoice details */
    invoiceNumber: {
      type: String,
      default: null,
      index: true,
    },

    invoicePath: {
      type: String,
      default: null,
    },

    /* 🔹 Subscription validity */
    subscriptionStart: {
      type: Date,
      default: Date.now,
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },

    /* 🔹 Auto-renew / recurring payment */
    autoRenew: {
      type: Boolean,
      default: false,
    },

    /* 🔹 Optional metadata / notes */
    notes: {
      type: String,
      default: "",
    },

    /* 🔹 Soft delete flag */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔹 Indexes for analytics */
paymentSchema.index({ user: 1, subscriptionPlan: 1, status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
