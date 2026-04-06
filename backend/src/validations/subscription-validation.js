const Joi = require("joi");

/* 🔹 Mongo ID */
const objectId = Joi.string().hex().length(24);

/* 🔹 Initiate Upgrade */
const initiateUpgradeSchema = Joi.object({
  newPlanId: objectId.required().messages({
    "any.required": "New plan ID is required",
  }),
});

/* 🔹 Verify Payment */
const verifyUpgradeSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  newPlanId: objectId.required(),
});

/* 🔹 Auto Renew (no body needed but keep safe) */
const emptySchema = Joi.object({}).unknown(false);

module.exports = {
  initiateUpgradeSchema,
  verifyUpgradeSchema,
  emptySchema,
};