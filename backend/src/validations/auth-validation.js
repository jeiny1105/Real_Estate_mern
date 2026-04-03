const Joi = require("joi");


/* ===============================
   👤 Buyer Registration Schema
================================ */
const registerBuyerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a valid 10-digit Indian phone number",
      "string.empty": "Phone number is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),

  role: Joi.string().valid("Buyer").optional(),

  profileImage: Joi.string().uri().optional(),
});


/* ===============================
   🏢 Seller Registration Schema
================================ */
const registerSellerSchema = Joi.object({
  /* User fields */
  name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a valid 10-digit Indian phone number",
      "string.empty": "Phone number is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),

  /* Seller-specific fields */
  companyName: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      "string.empty": "Company name is required",
    }),

  gstNumber: Joi.string()
    .allow("", null)
    .optional(),

});


/* ===============================
   🧑‍💼 Agent Registration Schema
================================ */
const registerAgentSchema = Joi.object({
  /* User fields */
  name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Enter a valid 10-digit Indian phone number",
      "string.empty": "Phone number is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),

  /* Agent-specific fields */
  agencyName: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      "string.empty": "Agency name is required",
      "string.min": "Agency name must be at least 2 characters",
    }),

  licenseNumber: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "License number is required",
    }),
});


/* ===============================
   🔐 Login Validation Schema
================================ */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
});

module.exports = {
  registerBuyerSchema,
  registerSellerSchema,
  registerAgentSchema,
  loginSchema,
};
