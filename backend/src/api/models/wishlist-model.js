const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    /* 🔹 User who wishlisted the property */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 🔹 Property being wishlisted */
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    /* 🔹 Optional: Seller (derived, not mandatory) */
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* 🔹 Prevent duplicate wishlist entries */
wishlistSchema.index(
  { user: 1, property: 1 },
  { unique: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
