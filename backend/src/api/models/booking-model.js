const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
      required: true,
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

    /* 🔹 Visit Scheduling */
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    /* 🔹 Visit Lifecycle */
    status: {
      type: String,
      enum: [
        "Pending",     // buyer requested
        "Confirmed",   // agent/seller approved
        "Rescheduled",
        "Completed",   // visit done
        "Cancelled",
        "No-Show",
      ],
      default: "Pending",
      index: true,
    },

    /* 🔹 Notes & Media */
    notes: {
      type: String,
      default: "",
    },

    propertySnapshot: {
      title: String,
      image: String,
      price: Number,
      location: String,
    },

    /* 🔹 Audit */
    cancelledBy: {
      type: String,
      enum: ["Buyer", "Agent", "Seller"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* 🔹 Prevent duplicate active bookings */
bookingSchema.index(
  { property: 1, buyer: 1, scheduledAt: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
