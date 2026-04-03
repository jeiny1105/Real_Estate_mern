const Joi = require("joi");

/* 🔹 Create Property */
const createPropertySchema = Joi.object({
  title: Joi.string().trim().min(3).required(),
  description: Joi.string().trim().min(10).required(),
  price: Joi.number().positive().required(),
  city: Joi.string().trim().required(),
  locality: Joi.string().trim().required(),
  location: Joi.string().trim().required(),

  propertyType: Joi.string()
    .valid("Apartment", "Villa", "House", "Cottage", "Plot", "Commercial")
    .required(),

  listingType: Joi.string()
    .valid("Sale", "Rent")
    .required(),

}).unknown(true); // allow nested objects for now

/* 🔹 Update Property */
const updatePropertySchema = Joi.object({
  title: Joi.string().trim().min(3),
  description: Joi.string().trim().min(10),
  price: Joi.number().positive(),
  city: Joi.string().trim(),
  locality: Joi.string().trim(),
}).min(1); // at least one field required

/* 🔹 ID Param */
const idParamSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createPropertySchema,
  updatePropertySchema,
  idParamSchema,
};