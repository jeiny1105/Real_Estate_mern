const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    /* 🔹 Core References */

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /* 🔹 Buyer Contact Snapshot */

    buyerName: {
      type: String,
      required: true,
      trim: true,
    },

    buyerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    buyerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    /* 🔹 Inquiry Content */

    message: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      default: "",
    },

    /* 🔹 Lead Lifecycle */

    status: {
      type: String,
      enum: [
        "Pending",
        "Seen",
        "Responded",
        "Visit Scheduled",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
      default: "Pending",
      index: true,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    /* 🔹 Visit Scheduling */

    visitDate: {
      type: Date,
      default: null,
    },

    visitTime: {
      type: String,
      default: null,
    },

    /* 🔹 Response Metadata */

    respondedAt: {
      type: Date,
      default: null,
    },

    responseBy: {
      type: String,
      enum: ["Seller", "Agent"],
      default: null,
    },

    /* 🔹 Inquiry Source */

    source: {
      type: String,
      enum: ["Marketplace", "AgentShare", "External"],
      default: "Marketplace",
    },

    /* 🔹 Archival */

    isArchived: {
      type: Boolean,
      default: false,
    },

    /* =========================================================
       🔥 Revenue Tracking (NEW - CORRECT PLACE)
    ========================================================= */

    dealAmount: {
      type: Number,
      default: 0,
    },

    commission: {
      type: Number,
      default: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    agentEarning: {
      type: Number,
      default: 0,
    },

    payoutStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

/* 🔹 Prevent duplicate inquiries */
inquirySchema.index(
  { property: 1, buyer: 1 },
  {
    unique: true,
    partialFilterExpression: { buyer: { $type: "objectId" } },
  }
);

/* 🔹 Agent dashboard optimization */
inquirySchema.index({ agent: 1, status: 1 });

/* 🔹 Seller dashboard optimization */
inquirySchema.index({ seller: 1, status: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);