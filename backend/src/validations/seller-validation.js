const Joi = require("joi");

/* 🔹 Update Seller Profile */
const updateSellerProfileSchema = Joi.object({
  companyName: Joi.string().min(2).optional(),

  gstNumber: Joi.string().allow(null, "").optional(),

  commissionRate: Joi.number().min(0).max(100).optional(),

  status: Joi.string()
    .valid("Active", "Inactive", "Blocked")
    .optional(),
}).min(1); // 🔥 at least one field required

module.exports = {
  updateSellerProfileSchema,
};