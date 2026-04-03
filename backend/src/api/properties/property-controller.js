const service = require("./property-service");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/asyncHandler");

/* 🔹 Helper: Parse Query Filters */
const parseFilters = (query) => {
  const filters = {};

  if (query.search) filters.search = query.search;
  if (query.city) filters.city = query.city;
  if (query.locality) filters.locality = query.locality;
  if (query.propertyType) filters.propertyType = query.propertyType;
  if (query.listingType) filters.listingType = query.listingType;
  if (query.bhk) filters.bhk = Number(query.bhk);

  if (query.minPrice !== undefined && query.minPrice !== "") {
    filters.minPrice = Number(query.minPrice);
  }

  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    filters.maxPrice = Number(query.maxPrice);
  }

  return filters;
};

/* 🔹 Get All */
const getProperties = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query);

  const properties = await service.fetchProperties(filters);

  res.status(200).json({
    success: true,
    results: properties.data.length,
    page: properties.page,
    limit: properties.limit,
    data: properties.data,
  });
});

/* 🔹 Get Pending */
const getPendingProperties = asyncHandler(async (req, res) => {
  const properties = await service.fetchPendingProperties();

  res.status(200).json({
    success: true,
    results: properties.length,
    data: properties,
  });
});

/* 🔹 Get By ID */
const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Property ID is required", 400);
  }

  const property = await service.getProperty(id);

  res.status(200).json({
    success: true,
    data: property,
  });
});

/* 🔹 Suggestions */
const getSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const suggestions = await service.getSearchSuggestions(q);

  res.status(200).json({
    success: true,
    data: suggestions,
  });
});

/* 🔹 Create */
const createProperty = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401);
  }

  const imagePaths = req.files
    ? req.files.map((file) => file.filename)
    : [];

  const newProperty = await service.addProperty(
    {
      ...req.body,
      images: imagePaths,
    },
    req.user.id
  );

  res.status(201).json({
    success: true,
    message: "Property created successfully",
    data: newProperty,
  });
});

/* 🔹 Update */
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Property ID is required", 400);
  }

  const updated = await service.editProperty(
    id,
    req.body,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    data: updated,
  });
});

/* 🔹 Delete */
const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Property ID is required", 400);
  }

  await service.removeProperty(id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
});

/* 🔹 Update Status */
const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Available", "Sold", "Pending", "Inactive"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid property status", 400);
  }

  const property = await service.changeStatus(
    id,
    status,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Property status updated",
    data: property,
  });
});

/* 🔹 My Properties */
const getMyProperties = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search || "",
    city: req.query.city || "",
    status: req.query.status || "",
  };

  const properties = await service.fetchMyProperties(
    req.user.id,
    filters
  );

  res.status(200).json({
    success: true,
    results: properties.length,
    data: properties,
  });
});

/* 🔹 Approval Status */
const updateApprovalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  const allowed = ["Pending", "Approved", "Rejected"];

  if (!allowed.includes(approvalStatus)) {
    throw new AppError("Invalid approval status", 400);
  }

  const updated = await service.changeApprovalStatus(id, approvalStatus);

  res.status(200).json({
    success: true,
    message: "Approval status updated",
    data: updated,
  });
});

/* 🔹 Toggle Featured */
const toggleFeatured = asyncHandler(async (req, res) => {
  const updated = await service.toggleFeatured(req.params.id);

  res.status(200).json({
    success: true,
    message: "Featured status updated",
    data: updated,
  });
});

/* 🔹 Assign Agent */
const assignAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { agentId } = req.body;

  if (!agentId) {
    throw new AppError("Agent ID is required", 400);
  }

  const property = await service.assignAgentToProperty(id, agentId);

  res.status(200).json({
    success: true,
    message: "Agent assigned successfully",
    data: property,
  });
});

/* 🔹 Reassign Agent */
const reassignAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { agentId } = req.body;

  if (!agentId) {
    throw new AppError("Agent ID is required", 400);
  }

  const property = await service.reassignAgentToProperty(id, agentId);

  res.status(200).json({
    success: true,
    message: "Agent reassigned successfully",
    data: property,
  });
});

/* 🔹 Assigned Properties */
const getAssignedProperties = asyncHandler(async (req, res) => {
  const properties = await service.fetchAssignedProperties();

  res.status(200).json({
    success: true,
    results: properties.length,
    data: properties,
  });
});

module.exports = {
  getProperties,
  getPendingProperties,
  getPropertyById,
  getSuggestions,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getMyProperties,
  updateApprovalStatus,
  toggleFeatured,
  assignAgent,
  reassignAgent,
  getAssignedProperties,
};