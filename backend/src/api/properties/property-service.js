const repository = require("./property-repository");
const AppError = require("../../utils/app-error");
const User = require("../models/user-model");
const slugify = require("slugify");
const Agent = require("../models/agent-model");
const Property = require("../models/property-model");

/* 🔥 Normalize Fields */
const normalizePropertyData = (data) => {
  // BHK
  if (data.residential?.bedrooms) {
    data.bhk = data.residential.bedrooms;
  }

  // Area
  if (["Apartment", "Villa", "House", "Cottage"].includes(data.propertyType)) {
    data.area = data.residential?.builtUpArea;
  }

  if (data.propertyType === "Commercial") {
    data.area = data.commercial?.areaSize;
  }

  if (data.propertyType === "Plot") {
    data.area = data.land?.plotArea;
  }
};

const fetchProperties = async (filters = {}) => {
  const now = new Date();

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const pipeline = [];

  /* ================= SEARCH ================= */
  if (filters.search) {
    pipeline.push({
      $search: {
        index: "property_search",
        compound: {
          should: [
            {
              autocomplete: {
                query: filters.search,
                path: "title",
                tokenOrder: "sequential",
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 3 } } // 🔥 title priority
              }
            },
            {
              autocomplete: {
                query: filters.search,
                path: "city",
                tokenOrder: "sequential",
                fuzzy: { maxEdits: 1 }
              }
            },
            {
              autocomplete: {
                query: filters.search,
                path: "locality",
                tokenOrder: "sequential",
                fuzzy: { maxEdits: 1 }
              }
            }
          ]
        }
      }
    });

    // 🔥 Add relevance score
    pipeline.push({
      $addFields: {
        score: { $meta: "searchScore" }
      }
    });
  }

  /* ================= FILTERS ================= */
  const matchStage = {
    approvalStatus: "Approved",
    agentDecision: "Approved",
    status: "Available",
    isDeleted: false,
    "subscription.listingExpiry": { $gt: now },
  };

  if (filters.city) matchStage.city = filters.city;
  if (filters.locality) matchStage.locality = filters.locality;
  if (filters.propertyType) matchStage.propertyType = filters.propertyType;
  if (filters.listingType) matchStage.listingType = filters.listingType;

  /* 💰 Price Range (FIXED) */
if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
  matchStage.price = {};

  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    matchStage.price.$gte = Number(filters.minPrice);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
    matchStage.price.$lte = Number(filters.maxPrice);
  }
}

  if (filters.bhk) {
    matchStage.bhk = Number(filters.bhk);
  }

  pipeline.push({ $match: matchStage });

  /* ================= SORT ================= */

  let sortStage = {};

  if (filters.search) {
    // 🔥 Priority: best match first
    sortStage = { score: -1 };
  } else {
    // 🔥 Normal sorting
    if (filters.sort === "price_asc") sortStage = { price: 1 };
    else if (filters.sort === "price_desc") sortStage = { price: -1 };
    else if (filters.sort === "oldest") sortStage = { createdAt: 1 };
    else sortStage = { createdAt: -1 }; // default newest
  }

  pipeline.push({ $sort: sortStage });

  /* ================= PAGINATION ================= */
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  /* ================= EXECUTE ================= */
  const properties = await Property.aggregate(pipeline);

  return {
    data: properties,
    page,
    limit,
  };
};


/* Get By ID */
const getProperty = async (id) => {
  const property = await repository.getPropertyById(id);
  if (!property) throw new AppError("Property not found", 404);
  return property;
};

/* Get Search Suggesstions */
const getSearchSuggestions = async (query) => {
  if (!query || query.trim() === "") return [];

  return await Property.aggregate([
    {
      $search: {
        index: "property_search",
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "title",
                fuzzy: { maxEdits: 1 }
              }
            },
            {
              autocomplete: {
                query: query,
                path: "city",
                fuzzy: { maxEdits: 1 }
              }
            },
            {
              autocomplete: {
                query: query,
                path: "locality",
                fuzzy: { maxEdits: 1 }
              }
            }
          ]
        }
      }
    },
    {
      $project: {
        title: 1,
        city: 1,
        locality: 1,
        score: { $meta: "searchScore" }
      }
    },
    {
      $limit: 5
    }
  ]);
};

/* Create */
const addProperty = async (data, userId) => {
  const requiredFields = [
    "title",
    "description",
    "price",
    "city",
    "locality",
    "location",
    "propertyType",
    "listingType",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
    throw new AppError("At least one image is required", 400);
  }

  /* Type-based validation */
  if (["Apartment", "Villa", "House", "Cottage"].includes(data.propertyType)) {
    if (!data.residential?.bedrooms)
      throw new AppError("Bedrooms are required", 400);
    if (!data.residential?.bathrooms)
      throw new AppError("Bathrooms are required", 400);
    if (!data.residential?.builtUpArea)
      throw new AppError("Built-up area is required", 400);
  }

  if (data.propertyType === "Plot") {
    if (!data.land?.plotArea)
      throw new AppError("Plot area is required", 400);
    if (!data.land?.zoningType)
      throw new AppError("Zoning type is required", 400);
  }

  if (data.propertyType === "Commercial") {
    if (!data.commercial?.areaSize)
      throw new AppError("Area size is required", 400);
  }

  /* 🔥 Normalize */
  normalizePropertyData(data);

  /* Fetch user */
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.role !== "Seller")
    throw new AppError("Only sellers can create properties", 403);

  if (!user.subscription.snapshot)
    throw new AppError("No active subscription found", 403);

  if (user.subscription.status !== "Active")
    throw new AppError("Subscription is not active", 403);

  if (
    !user.subscription.expiryDate ||
    user.subscription.expiryDate < new Date()
  ) {
    throw new AppError("Subscription has expired", 403);
  }

  const snapshot = user.subscription.snapshot;

  const activeListings = await repository.countActiveListings(userId);

  if (activeListings >= snapshot.limits.maxListings) {
    throw new AppError(
      `Listing limit reached. Your plan allows ${snapshot.limits.maxListings} active listings.`,
      403
    );
  }

  /* Listing expiry */
  const today = new Date();
  const listingExpiry = new Date();
  listingExpiry.setDate(
    today.getDate() + snapshot.limits.activeListingDays
  );

  data.seller = userId;
  data.subscription = {
    plan: user.subscription.plan,
    listingExpiry,
  };

  delete data.approvalStatus;
  delete data.isFeatured;
  delete data.views;
  delete data.inquiriesCount;

  sanitizeSections(data);

  /* Slug */
  const baseSlug = slugify(data.title, { lower: true, strict: true });

  let slug = baseSlug;
  let counter = 1;

  while (await repository.findBySlug(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  data.slug = slug;

  return await repository.createProperty(data);
};

/* Update */
const editProperty = async (id, data, userId) => {
  const existing = await repository.getPropertyById(id);
  if (!existing) throw new AppError("Property not found", 404);

  if (existing.seller.toString() !== userId)
    throw new AppError("Not authorized", 403);

  delete data.approvalStatus;
  delete data.isFeatured;
  delete data.views;
  delete data.inquiriesCount;
  delete data.seller;

  /* 🔥 Normalize */
  normalizePropertyData(data);

  sanitizeSections(data);

  return await repository.updateProperty(id, data);
};

/* Soft Delete */
const removeProperty = async (id, userId) => {
  const existing = await repository.getPropertyById(id);

  if (!existing) throw new AppError("Property not found", 404);

  if (existing.seller._id.toString() !== userId)
    throw new AppError("Not authorized", 403);

  return await repository.deleteProperty(id);
};

/* Change Status */
const changeStatus = async (id, status, userId) => {
  const allowedStatuses = ["Available", "Sold", "Pending", "Inactive"];
  if (!allowedStatuses.includes(status))
    throw new AppError("Invalid property status", 400);

  const existing = await repository.getPropertyById(id);
  if (!existing) throw new AppError("Property not found", 404);

  if (existing.seller.toString() !== userId)
    throw new AppError("Not authorized", 403);

  if (status === "Available") {
    const user = await User.findById(userId);

    if (!user.subscription.snapshot)
      throw new AppError("No active subscription found", 403);

    if (user.subscription.status !== "Active")
      throw new AppError("Subscription is not active", 403);

    if (
      !user.subscription.expiryDate ||
      user.subscription.expiryDate < new Date()
    ) {
      throw new AppError("Subscription has expired", 403);
    }

    const activeListings =
      await repository.countActiveListings(userId);

    if (
      activeListings >=
      user.subscription.snapshot.limits.maxListings
    ) {
      throw new AppError(
        `Listing limit reached. Your plan allows ${user.subscription.snapshot.limits.maxListings} active listings.`,
        403
      );
    }
  }

  return await repository.updateStatus(id, status);
};

/* Helper */
const sanitizeSections = (data) => {
  if (data.propertyType === "Commercial") {
    delete data.residential;
    delete data.land;
  }

  if (data.propertyType === "Plot") {
    delete data.residential;
    delete data.commercial;
  }

  if (
    data.propertyType !== "Plot" &&
    data.propertyType !== "Commercial"
  ) {
    delete data.commercial;
    delete data.land;
  }
};

const fetchMyProperties = async (userId, filters = {}) => {
  return await repository.getPropertiesBySeller(userId, filters);
};

const changeApprovalStatus = async (id, approvalStatus) => {
  const updated = await repository.updateApprovalStatus(id, approvalStatus);
  if (!updated) throw new AppError("Property not found", 404);
  return updated;
};

const toggleFeatured = async (id) => {
  const updated = await repository.toggleFeatured(id);
  if (!updated) throw new AppError("Property not found", 404);
  return updated;
};

/* Get Pending Properties (Admin) */
const fetchPendingProperties = async () => {
  return await repository.getPendingProperties();
};

/* Assign Agent */
const assignAgentToProperty = async (propertyId, agentId) => {
  const property = await repository.getPropertyById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.approvalStatus !== "Approved") {
    throw new AppError("Property must be approved first", 400);
  }

  const agent = await Agent.findById(agentId);

  if (!agent) {
    throw new AppError("Agent not found", 404);
  }

  if (agent.status !== "Active") {
    throw new AppError("Agent is not active", 400);
  }

  return await repository.assignAgent(propertyId, agent.user);
};

/* Reassign Agent */
const reassignAgentToProperty = async (propertyId, agentId) => {
  const property = await repository.getPropertyById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.agentDecision !== "Rejected") {
    throw new AppError("Property must be rejected before reassignment", 400);
  }

  const agent = await Agent.findById(agentId);

  if (!agent) {
    throw new AppError("Agent not found", 404);
  }

  if (agent.status !== "Active") {
    throw new AppError("Agent is not active", 400);
  }

  return await repository.reassignAgent(propertyId, agent.user);
};

/* Assigned Properties */
const fetchAssignedProperties = async () => {
  return await repository.getAssignedProperties();
};

module.exports = {
  fetchProperties,
  getProperty,
  getSearchSuggestions,
  addProperty,
  editProperty,
  removeProperty,
  changeStatus,
  fetchMyProperties,
  changeApprovalStatus,
  toggleFeatured,
  fetchPendingProperties,
  assignAgentToProperty,
  reassignAgentToProperty,
  fetchAssignedProperties,
};