const Joi = require("joi");

/* 🔹 Mongo ID */
const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

/* 🔹 Create Plan */
const createPlanSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().required(),

  planFor: Joi.string()
    .valid("Seller", "Agent", "Both")
    .required(),

  pricing: Joi.object({
    price: Joi.number().min(0).required(),
    durationInDays: Joi.number().min(1).required(),
  }).required(),

  limits: Joi.object({
    maxListings: Joi.number().min(0),
    activeListingDays: Joi.number().min(1),
    maxFeaturedListings: Joi.number().min(0),
    maxLeads: Joi.number().min(0),
  }).optional(),

  features: Joi.object({
    featuredListings: Joi.boolean(),
    canEditListings: Joi.boolean(),
    canDeleteListings: Joi.boolean(),
    prioritySupport: Joi.boolean(),
    aiRecommendations: Joi.boolean(),
    analyticsDashboard: Joi.boolean(),
    crmAccess: Joi.boolean(),
    notifications: Joi.boolean(),
  }).optional(),

  status: Joi.string().valid("Active", "Inactive").optional(),
});

/* 🔹 Update Plan */
const updatePlanSchema = createPlanSchema.fork(
  Object.keys(createPlanSchema.describe().keys),
  (field) => field.optional()
);

module.exports = {
  idParamSchema,
  createPlanSchema,
  updatePlanSchema,
};