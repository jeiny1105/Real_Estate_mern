const Joi = require("joi");

/* 🔹 Property ID param */
const propertyIdParamSchema = Joi.object({
  propertyId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "Invalid property ID",
      "string.length": "Invalid property ID length",
    }),
});

/* 🔹 Reject reason */
const rejectPropertySchema = Joi.object({
  reason: Joi.string().min(3).optional(),
});

module.exports = {
  propertyIdParamSchema,
  rejectPropertySchema,
};