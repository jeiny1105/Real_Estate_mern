const Property = require("../models/property-model");

/* 🔹 Build Advanced Query */
const buildQuery = (filters) => {
  const now = new Date();

  const query = {
    isDeleted: false,
    status: "Available",
    approvalStatus: "Approved",
    agentDecision: "Approved",
    "subscription.listingExpiry": { $gt: now },
  };

  /* 🔍 Text Search */
if (filters.search) {
  const exact = new RegExp(`^${filters.search}$`, "i");
  const loose = new RegExp(filters.search, "i");

  query.$and = [
    {
      $or: [
        { city: exact },
        { locality: exact },
        { location: exact },
      ],
    },
    {
      $or: [
        { title: loose },
      ],
    },
  ];
}

  /* 📍 Location Filters */
  if (filters.city) {
    query.city = new RegExp(`^${filters.city}$`, "i");
  }

  if (filters.locality) {
    query.locality = new RegExp(filters.locality, "i");
  }

  /* 🏠 Type Filters */
  if (filters.propertyType) {
    query.propertyType = filters.propertyType;
  }

  if (filters.listingType) {
    query.listingType = filters.listingType;
  }

  /* 🛏️ BHK */
  if (filters.bhk) {
    query.bhk = Number(filters.bhk);
  }

  /* 💰 Price Range */
if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
  query.price = {};

  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    query.price.$gte = Number(filters.minPrice);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
    query.price.$lte = Number(filters.maxPrice);
  }
}

  /* 📐 Area Range */
  if (filters.area) {
    query.area = {};
    if (filters.area.$gte !== undefined) {
      query.area.$gte = filters.area.$gte;
    }
    if (filters.area.$lte !== undefined) {
      query.area.$lte = filters.area.$lte;
    }
  }

  return query;
};

/* 🔹 Get All (Filters + Sorting + Pagination) */
const getAllProperties = async (filters = {}) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const query = buildQuery(filters);

  /* 🔥 Sorting */
  const sortOptions = {
    newest: { createdAt: -1 },
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    popular: { views: -1 },
  };

  const sort = sortOptions[filters.sort] || { createdAt: -1 };

  /* 🔥 Query Execution */
  const properties = await Property.find(query)
    .populate("seller", "name email")
    .populate("agent", "name email")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Property.countDocuments(query);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data: properties,
  };
};

/* 🔹 Get Pending Properties (Admin) */
const getPendingProperties = async () => {
  return await Property.find({
    isDeleted: false,
    $or: [
      { approvalStatus: "Pending" },
      { approvalStatus: "Approved", agent: null },
      { agentDecision: "Rejected" },
      { approvalStatus: "Rejected" },
    ],
  })
    .populate("seller", "name email")
    .populate("agent", "name email")
    .sort({ createdAt: -1 });
};

/* 🔹 Get Assigned Properties (Admin) */
const getAssignedProperties = async () => {
  return await Property.find({
    approvalStatus: "Approved",
    agent: { $ne: null },
    agentDecision: { $ne: "Rejected" },
    isDeleted: false,
  })
    .populate("seller", "name email")
    .populate("agent", "name email")
    .sort({ createdAt: -1 });
};

/* 🔹 Get by ID */
const getPropertyById = async (id) => {
  const property = await Property.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("seller", "name email")
    .populate("agent", "name email");

  return property;
};

/* 🔹 Check Slug */
const findBySlug = async (slug) => {
  return await Property.findOne({ slug });
};

/* 🔹 Create */
const createProperty = async (data) => {
  return await Property.create(data);
};

/* 🔹 Update */
const updateProperty = async (id, data) => {
  return await Property.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true, runValidators: true }
  );
};

/* 🔹 Delete */
const deleteProperty = async (id) => {
  return await Property.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

/* 🔹 Update Status */
const updateStatus = async (id, status) => {
  return await Property.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status },
    { new: true }
  );
};

/* 🔹 Get Seller Properties */
const getPropertiesBySeller = async (sellerId, filters = {}) => {
  const query = {
    seller: sellerId,
    isDeleted: false,
  };

  /* 🔍 SEARCH */
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { location: { $regex: filters.search, $options: "i" } },
      { city: { $regex: filters.search, $options: "i" } },
      { locality: { $regex: filters.search, $options: "i" } },
    ];
  }

  /* 📍 CITY */
  if (filters.city) {
    query.city = { $regex: filters.city, $options: "i" };
  }

  /* 📊 STATUS */
  if (filters.status) {
    query.status = filters.status;
  }

  return await Property.find(query).sort({ createdAt: -1 });
};

/* 🔹 Approval Status */
const updateApprovalStatus = async (id, approvalStatus) => {
  return await Property.findByIdAndUpdate(
    id,
    { approvalStatus },
    { new: true }
  );
};

/* 🔹 Toggle Featured */
const toggleFeatured = async (id) => {
  const property = await Property.findById(id);
  if (!property) return null;

  property.isFeatured = !property.isFeatured;
  return await property.save();
};

/* 🔹 Count Active Listings */
const countActiveListings = async (sellerId) => {
  const now = new Date();

  return await Property.countDocuments({
    seller: sellerId,
    status: "Available",
    approvalStatus: "Approved",
    isDeleted: false,
    "subscription.listingExpiry": { $gt: now },
  });
};

/* 🔹 Assign Agent */
const assignAgent = async (propertyId, agentUserId) => {
  return await Property.findByIdAndUpdate(
    propertyId,
    {
      agent: agentUserId,
      agentDecision: "Pending",
      agentRejectReason: null,
    },
    { new: true }
  )
    .populate("seller", "name email")
    .populate("agent", "name email");
};

/* 🔹 Reassign Agent */
const reassignAgent = async (propertyId, agentUserId) => {
  return await Property.findByIdAndUpdate(
    propertyId,
    {
      agent: agentUserId,
      agentDecision: "Pending",
      agentRejectReason: null,
    },
    { new: true }
  )
    .populate("seller", "name email")
    .populate("agent", "name email");
};

module.exports = {
  getAllProperties,
  getPendingProperties,
  getAssignedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updateStatus,
  getPropertiesBySeller,
  updateApprovalStatus,
  toggleFeatured,
  countActiveListings,
  findBySlug,
  assignAgent,
  reassignAgent,
};