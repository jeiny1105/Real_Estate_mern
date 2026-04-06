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

/* 🔹 Update Status */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Pending", "Responded", "Closed", "Visit Scheduled")
    .required(),
});

/* 🔹 Respond */
const respondSchema = Joi.object({
  response: Joi.string().min(2).required(),
});

/* 🔹 Schedule Visit */
const scheduleVisitSchema = Joi.object({
  visitDate: Joi.date().required(),
  visitTime: Joi.string().required(),
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