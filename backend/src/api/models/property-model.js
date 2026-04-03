const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    /* 🔹 Ownership */
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
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
      index: true,
    },

    /* 🔹 Agent Review */
    agentDecision: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },

    agentRejectReason: {
      type: String,
      trim: true,
      default: null,
    },

    /* 🔹 SEO */
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    /* 🔹 Subscription */
    subscription: {
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        default: null,
      },
      listingExpiry: {
        type: Date,
        default: null,
        index: true,
      },
    },

    /* 🔹 Core Info */
    title: {
      type: String,
      required: true,
      trim: true,
      index: "text",
    },

    description: {
      type: String,
      required: true,
      index: "text",
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    /* 🔥 NEW (IMPORTANT) */
    city: {
      type: String,
      required: true,
      index: true,
    },

    locality: {
      type: String,
      required: true,
      index: true,
    },

    /* Optional display field */
    location: {
      type: String,
      required: true,
    },

    /* 🔥 GEO SEARCH READY */
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Cottage", "House", "Plot", "Commercial"],
      required: true,
      index: true,
    },

    listingType: {
      type: String,
      enum: ["Sale", "Rent"],
      required: true,
      index: true,
    },

    /* 🔥 COMMON FILTER FIELD */
    area: {
      type: Number,
      index: true,
    },

    /* 🔥 IMPORTANT FOR FILTER */
    bhk: {
      type: Number,
      index: true,
    },

    /* 🔹 Residential */
    residential: {
      bedrooms: { type: Number, min: 0, default: 0 },
      bathrooms: { type: Number, min: 0, default: 0 },
      kitchens: { type: Number, min: 0, default: 0 },
      builtUpArea: { type: Number, min: 0, default: 0 },
      furnishing: {
        type: String,
        enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
        default: "Unfurnished",
      },
    },

    /* 🔹 Commercial */
    commercial: {
      areaSize: { type: Number, min: 0, default: 0 },
      floors: { type: Number, min: 0, default: 0 },
      parkingSpaces: { type: Number, min: 0, default: 0 },
      businessType: { type: String, trim: true },
    },

    /* 🔹 Land */
    land: {
      plotArea: { type: Number, min: 0, default: 0 },
      areaUnit: {
        type: String,
        enum: ["sqft", "sqyd", "acre"],
        default: "sqft",
      },
      facing: {
        type: String,
        enum: [
          "North",
          "South",
          "East",
          "West",
          "North-East",
          "North-West",
          "South-East",
          "South-West",
        ],
      },
      zoningType: {
        type: String,
        enum: ["Residential", "Commercial", "Agricultural", "Industrial"],
      },
      approvalStatus: {
        type: String,
        enum: ["Approved", "Unapproved", "NA"],
        default: "NA",
      },
    },

    /* 🔹 Media */
    amenities: {
      type: [String],
      default: [],
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    /* 🔹 Admin Moderation */
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* 🔹 Status */
    status: {
      type: String,
      enum: ["Available", "Sold", "Pending", "Inactive"],
      default: "Available",
      index: true,
    },

    /* 🔹 Metrics */
    views: {
      type: Number,
      default: 0,
    },

    inquiriesCount: {
      type: Number,
      default: 0,
    },

    /* 🔹 Soft Delete */
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/* 🔍 Full Text Search */
propertySchema.index({
  title: "text",
  description: "text",
  city: "text",
  locality: "text",
});

/* 🔍 Filtering Index */
propertySchema.index({
  city: 1,
  propertyType: 1,
  listingType: 1,
  price: 1,
  createdAt: -1,
});

/* 🌍 Geo Index */
propertySchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Property", propertySchema);