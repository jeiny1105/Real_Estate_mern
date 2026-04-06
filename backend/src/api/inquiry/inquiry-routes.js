const express = require("express");
const router = express.Router();

const inquiryController = require("./inquiry-controller");

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const validateRequest = require("../../middlewares/validateRequest-middleware");

/* 🔥 IMPORT LIMITER */
const { inquiryLimiter } = require("../../middlewares/rate-limit-middleware");

const PERMISSIONS = require("../../config/permissions");

/* 🔹 Validation */
const {
  idParamSchema,
  createInquirySchema,
  updateStatusSchema,
  respondSchema,
  scheduleVisitSchema,
  sendMessageSchema,
} = require("../../validations/inquiry-validation");

/* =========================================================
   CREATE INQUIRY (Buyer / Guest)
========================================================= */

router.post(
  "/properties/:id/inquiry",
  authenticate,
  inquiryLimiter, // 🔥 (ANTI-SPAM)
  validateRequest(idParamSchema, "params"),
  validateRequest(createInquirySchema),
  inquiryController.createInquiry
);

/* =========================================================
   AGENT LEADS ROUTES
========================================================= */

router.use(authenticate);
router.use(authorizePermission(PERMISSIONS.PROPERTIES_READ));

router.get("/agent/leads", inquiryController.getAgentLeads);

router.patch(
  "/agent/leads/:id",
  validateRequest(idParamSchema, "params"),
  validateRequest(updateStatusSchema),
  inquiryController.updateLeadStatus
);

router.patch(
  "/agent/leads/:id/respond",
  validateRequest(idParamSchema, "params"),
  validateRequest(respondSchema),
  inquiryController.respondToInquiry
);

router.get(
  "/agent/leads/:id/messages",
  validateRequest(idParamSchema, "params"),
  inquiryController.getInquiryMessages
);

router.patch(
  "/agent/leads/:id/schedule",
  validateRequest(idParamSchema, "params"),
  validateRequest(scheduleVisitSchema),
  inquiryController.scheduleVisit
);

/* =========================================================
   BUYER ROUTES
========================================================= */

router.get("/buyer/inquiries", inquiryController.getBuyerInquiries);

router.get(
  "/buyer/inquiries/:id/messages",
  validateRequest(idParamSchema, "params"),
  inquiryController.getInquiryMessages
);

router.post(
  "/buyer/inquiries/:id/messages",
  inquiryLimiter, // 🔥(ANTI-SPAM CHAT)
  validateRequest(idParamSchema, "params"),
  validateRequest(sendMessageSchema),
  inquiryController.sendMessage
);

module.exports = router;