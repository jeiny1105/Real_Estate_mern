const Joi = require("joi");

/* 🔹 Update Profile */
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).optional(),

  email: Joi.string().email().optional(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),

  currentPassword: Joi.string().min(6).optional(),

  newPassword: Joi.string().min(6).optional(),

  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .optional()
    .messages({
      "any.only": "Passwords do not match",
    }),

  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postalCode: Joi.string().optional(),
});

module.exports = {
  updateProfileSchema,
};