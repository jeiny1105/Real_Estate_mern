const Joi = require("joi");

/* 🔹 Create Order */
const createOrderSchema = Joi.object({
  subscriptionPlanId: Joi.string().required(),
});

/* 🔹 Verify Payment */
const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  subscriptionPlanId: Joi.string().required(),
});

/* 🔹 Payment ID param */
const paymentIdParamSchema = Joi.object({
  paymentId: Joi.string().required(),
});

module.exports = {
  createOrderSchema,
  verifyPaymentSchema,
  paymentIdParamSchema,
};