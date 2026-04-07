const Inquiry = require("../models/inquiry-model");

/* =========================================================
   🔹 CREATE INQUIRY
========================================================= */
const createInquiry = async (data) => {
  return await Inquiry.create(data);
};

/* =========================================================
   🔹 FIND DUPLICATE INQUIRY
========================================================= */
const findDuplicateInquiry = async (propertyId, buyerId, email) => {
  const query = {
    property: propertyId,
    $or: []
  };

  if (buyerId) {
    query.$or.push({ buyer: buyerId });
  }

  if (email) {
    query.$or.push({ buyerEmail: email });
  }

  return await Inquiry.findOne(query);
};

/* =========================================================
   🔹 GET INQUIRY BY ID
========================================================= */
const getInquiryById = async (id) => {
  return await Inquiry.findById(id)
    .populate("property", "title price location")
    .populate("buyer", "name email")
    .populate("seller", "name email")
    .populate("agent", "name email");
};

/* =========================================================
   🔹 GET AGENT LEADS
========================================================= */
const getAgentLeads = async (agentId) => {
  return await Inquiry.find({
    agent: agentId,
    isArchived: false
  })
    .populate("property", "title price location")
    .populate("buyer", "name email")
    .sort({ createdAt: -1 });
};

/* =========================================================
   🔹 GET BUYER INQUIRIES
========================================================= */
const getBuyerInquiries = async (buyerId) => {
  return await Inquiry.find({
    buyer: buyerId,
    isArchived: false
  })
    .populate("property", "title price location")
    .populate("agent", "name email")
    .sort({ createdAt: -1 });
};

/* =========================================================
   🔹 GET BUYER INQUIRY FOR PROPERTY
========================================================= */

const getBuyerInquiryForProperty = async (propertyId, buyerId) => {
  return await Inquiry.findOne({
    property: propertyId,
    buyer: buyerId,
    isArchived: false,
  })
    .populate("property", "title price location")
    .populate("agent", "name email");
};

/* =========================================================
   🔹 UPDATE LEAD STATUS (UPDATED 🔥)
========================================================= */
const updateLeadStatus = async (inquiryId, updateData) => {
  return await Inquiry.findByIdAndUpdate(
    inquiryId,
    updateData,
    { new: true }
  )
    .populate("property", "title price location")
    .populate("buyer", "name email")
    .populate("agent", "name email");
};

/* =========================================================
   🔹 RESPOND TO INQUIRY
========================================================= */
const respondToInquiry = async (inquiryId, response) => {
  return await Inquiry.findByIdAndUpdate(
    inquiryId,
    {
      response,
      status: "Responded",
      respondedAt: new Date(),
      responseBy: "Agent"
    },
    { new: true }
  ).populate("property");
};

/* =========================================================
   🔹 SCHEDULE VISIT
========================================================= */
const updateVisitSchedule = async (inquiryId, visitDate, visitTime) => {
  const inquiry = await Inquiry.findById(inquiryId);

  if (!inquiry) return null;

  inquiry.visitDate = new Date(visitDate);
  inquiry.visitTime = visitTime;
  inquiry.status = "Visit Scheduled";

  await inquiry.save();

  return await Inquiry.findById(inquiryId)
    .populate("property", "title price location")
    .populate("buyer", "name email")
    .populate("agent", "name email");
};

/* =========================================================
   🔹 VALIDATE INQUIRY ACCESS
========================================================= */
const getInquiryForUser = async (inquiryId, userId) => {
  return await Inquiry.findOne({
    _id: inquiryId,
    $or: [
      { buyer: userId },
      { agent: userId },
      { seller: userId }
    ]
  });
};

module.exports = {
  createInquiry,
  findDuplicateInquiry,
  getInquiryById,
  getAgentLeads,
  getBuyerInquiries,
  getBuyerInquiryForProperty,
  updateLeadStatus,
  respondToInquiry,
  updateVisitSchedule,
  getInquiryForUser,
};