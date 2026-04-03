const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    /* 🔹 Reference to User */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* 🔹 Seller Details */
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      default: null, // optional for individual sellers
    },

    /* 🔹 Properties & Listings */
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    activeListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],

    /* 🔹 Bookings handled */
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],

    /* 🔹 Performance Metrics */
    performance: {
      totalListings: { type: Number, default: 0 },
      listingsSold: { type: Number, default: 0 },
      bookingsCompleted: { type: Number, default: 0 },
      responseTimeAvg: { type: Number, default: 0 }, // in hours
    },

    /* 🔹 Commission / Earnings */
    commissionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 5, // % per successful booking or sale
    },
    earnings: {
      type: Number,
      default: 0,
    },

    /* 🔹 Status & Availability */
    status: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Inactive",
      index: true,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Seller", sellerSchema);
