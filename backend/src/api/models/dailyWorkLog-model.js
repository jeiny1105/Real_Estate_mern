const mongoose = require("mongoose");

const dailyWorkLogSchema = new mongoose.Schema(
  {
    /* 🔹 User performing the tasks */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 🔹 Role of the user (Seller, Agent, Admin) */
    role: {
      type: String,
      enum: ["Seller", "Agent", "Admin"],
      required: true,
    },

    /* 🔹 Date of the log */
    date: {
      type: Date,
      required: true,
      default: () => new Date().setHours(0, 0, 0, 0), // stores only the day
      index: true,
    },

    /* 🔹 Task details */
    tasksCompleted: {
      type: [String], // e.g., ["Posted 3 properties", "Responded to 5 inquiries"]
      default: [],
    },

    propertiesListed: {
      type: Number,
      default: 0,
    },

    leadsHandled: {
      type: Number,
      default: 0,
    },

    bookingsHandled: {
      type: Number,
      default: 0,
    },

    /* 🔹 Optional notes or remarks */
    notes: {
      type: String,
      default: "",
    },

    /* 🔹 Soft delete */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔹 Indexes for fast analytics */
dailyWorkLogSchema.index({ user: 1, date: 1, role: 1 });

module.exports = mongoose.model("DailyWorkLog", dailyWorkLogSchema);
