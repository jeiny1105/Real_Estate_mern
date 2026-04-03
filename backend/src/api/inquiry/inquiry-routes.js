const express = require("express");
const router = express.Router();

const inquiryController = require("./inquiry-controller");

const authenticate = require("../../middlewares/auth-middleware");
const authorizePermission = require("../../middlewares/permission-middleware");
const PERMISSIONS = require("../../config/permissions");

/* =========================================================
   CREATE INQUIRY (Buyer / Guest)
========================================================= */

router.post(
  "/properties/:id/inquiry",
  authenticate,   
  inquiryController.createInquiry
);

/* =========================================================
   AGENT LEADS ROUTES
========================================================= */

router.use(authenticate);
router.use(authorizePermission(PERMISSIONS.PROPERTIES_READ));

router.get(
  "/agent/leads",
  inquiryController.getAgentLeads
);

router.patch(
  "/agent/leads/:id",
  inquiryController.updateLeadStatus
);

router.patch(
  "/agent/leads/:id/respond",
  inquiryController.respondToInquiry
);

router.get(
  "/agent/leads/:id/messages",
  inquiryController.getInquiryMessages
);

router.patch(
  "/agent/leads/:id/schedule",
  inquiryController.scheduleVisit
);


// Buyer 
router.get(
  "/buyer/inquiries",
  inquiryController.getBuyerInquiries
);

router.get(
  "/buyer/inquiries/:id/messages",
  inquiryController.getInquiryMessages
);

router.post(
  "/buyer/inquiries/:id/messages",
  inquiryController.sendMessage
);

module.exports = router;