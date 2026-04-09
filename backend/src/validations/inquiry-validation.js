const Joi = require("joi");

/* 🔹 Mongo ID param */
const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid ID",
    "string.length": "Invalid ID length",
  }),
});

/* 🔹 Create Inquiry */
const createInquirySchema = Joi.object({
  buyerName: Joi.string().min(2).optional(),
  buyerEmail: Joi.string().email().optional(),
  buyerPhone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  message: Joi.string().min(5).required().messages({
    "string.empty": "Message is required",
  }),
});

/* =========================================================
   🔹 Update Status (UPDATED 🔥)
========================================================= */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "Pending",
      "Seen",
      "Responded",
      "Visit Scheduled",
      "Negotiation",
      "Closed Won",
      "Closed Lost"
    )
    .required(),

  dealAmount: Joi.when("status", {
    is: "Closed Won",
    then: Joi.number()
      .positive()
      .required()
      .messages({
        "any.required": "Deal amount is required when closing deal",
        "number.base": "Deal amount must be a number",
        "number.positive": "Deal amount must be greater than 0",
      }),
    otherwise: Joi.forbidden(),
  }),
});

/* 🔹 Respond */
const respondSchema = Joi.object({
  response: Joi.string().min(2).required(),
});

/* 🔹 Schedule Visit */
const scheduleVisitSchema = Joi.object({
  visitDate: Joi.date()
    .min("now")
    .required()
    .messages({
      "date.min": "Visit date cannot be in the past",
    }),

  visitTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:mm format",
    }),
});

/* 🔹 Send Message */
const sendMessageSchema = Joi.object({
  text: Joi.string().min(1).required(),
});

module.exports = {
  idParamSchema,
  createInquirySchema,
  updateStatusSchema,
  respondSchema,
  scheduleVisitSchema,
  sendMessageSchema,
};