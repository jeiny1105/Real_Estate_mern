const inquiryService = require("./inquiry-service");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/asyncHandler");

/* =========================================================
   🔹 CREATE INQUIRY (Buyer / Guest)
========================================================= */
const createInquiry = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  if (!propertyId) {
    throw new AppError("Property ID is required", 400);
  }

  const inquiry = await inquiryService.createInquiry(
    propertyId,
    req.body,
    req.user || null
  );

  res.status(201).json({
    success: true,
    message: "Inquiry sent successfully",
    data: inquiry,
  });
});

/* =========================================================
   🔹 GET BUYER INQUIRIES
========================================================= */
const getBuyerInquiries = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const inquiries = await inquiryService.getBuyerInquiries(req.user.id);

  res.status(200).json({
    success: true,
    results: inquiries.length,
    data: inquiries,
  });
});

/* =========================================================
   🔹 GET BUYER INQUIRY FOR PROPERTY
========================================================= */
const getBuyerInquiryForProperty = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const inquiry = await inquiryService.getBuyerInquiryForProperty(
    propertyId,
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: inquiry,
  });
});

/* =========================================================
   🔹 GET AGENT LEADS
========================================================= */
const getAgentLeads = asyncHandler(async (req, res) => {
  const agentId = req.user.id;

  const leads = await inquiryService.getAgentLeads(agentId);

  res.status(200).json({
    success: true,
    results: leads.length,
    data: leads,
  });
});

/* =========================================================
   🔹 UPDATE LEAD STATUS
========================================================= */
const updateLeadStatus = asyncHandler(async (req, res) => {
  const inquiryId = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const updated = await inquiryService.updateLeadStatus(
    inquiryId,
    status,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: `Lead status updated to ${status}`,
    data: updated,
  });
});

/* =========================================================
   🔹 RESPOND TO INQUIRY
========================================================= */
const respondToInquiry = asyncHandler(async (req, res) => {
  const inquiryId = req.params.id;
  const { response } = req.body;

  if (!response) {
    throw new AppError("Response message is required", 400);
  }

  const updated = await inquiryService.respondToInquiry(
    inquiryId,
    response,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Response sent successfully",
    data: updated,
  });
});

/* =========================================================
   🔹 GET MESSAGES
========================================================= */
const getInquiryMessages = asyncHandler(async (req, res) => {
  const inquiryId = req.params.id;

  const messages = await inquiryService.getInquiryMessages(
    inquiryId,
    req.user.id
  );

  res.status(200).json({
    success: true,
    results: messages.length,
    data: messages,
  });
});

/* =========================================================
   🔹 SCHEDULE VISIT
========================================================= */
const scheduleVisit = asyncHandler(async (req, res) => {
  const inquiryId = req.params.id;
  const { visitDate, visitTime } = req.body;

  if (!visitDate || !visitTime) {
    throw new AppError("Visit date and time are required", 400);
  }

  const updated = await inquiryService.scheduleVisit(
    inquiryId,
    visitDate,
    visitTime,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Visit scheduled successfully",
    data: updated,
  });
});

/* =========================================================
   🔹 SEND MESSAGE (Buyer / Agent Chat)
========================================================= */
const sendMessage = asyncHandler(async (req, res) => {
  const inquiryId = req.params.id;
  const { text } = req.body;

  if (!text) {
    throw new AppError("Message required", 400);
  }

  const message = await inquiryService.sendMessage(
    inquiryId,
    text,
    req.user.id
  );

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
});

module.exports = {
  createInquiry,
  getBuyerInquiries,
  getBuyerInquiryForProperty,
  getAgentLeads,
  updateLeadStatus,
  respondToInquiry,
  getInquiryMessages,
  scheduleVisit,
  sendMessage,
};