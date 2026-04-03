const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    /* 🔹 Reference to User */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* 🔹 Agent Onboarding Details */
    agencyName: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    /* 🔹 Assigned Properties */
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    /* 🔹 Assigned Leads / Inquiries */
    inquiries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inquiry",
      },
    ],

    /* 🔹 Bookings handled */
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],

    /* 🔹 Commission / Earnings */
    commissionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 5, // % per successful booking or sale
    },
    earnings: {
      type: Number,
      default: 0, // total earned
    },

    /* 🔹 Performance Metrics */
    performance: {
      totalLeads: { type: Number, default: 0 },
      leadsConverted: { type: Number, default: 0 },
      bookingsCompleted: { type: Number, default: 0 },
      responseTimeAvg: { type: Number, default: 0 }, // in hours
    },

    /* 🔹 Status & Availability */
    status: {
      type: String,
      enum: ["Pending", "Active", "Rejected", "Blocked","Inactive"],
      default: "Inactive",
      index: true,
    },
  },
  { timestamps: true }
);

/* 🔹 Optional: Populate User automatically */
agentSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name email phone profileImage subscription",
  });
});


module.exports = mongoose.model("Agent", agentSchema);
