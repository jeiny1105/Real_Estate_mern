const repository = require("./inquiry-repository");
const propertyRepository = require("../properties/property-repository");
const AppError = require("../../utils/app-error");
const sendEmail = require("../../emails/services/emailService");
const inquiryTemplate = require("../../emails/templates/inquiryConfirmation");
const agentResponseTemplate = require("../../emails/templates/agentResponse");
const visitTemplate = require("../../emails/templates/visitSchedule");
const Message = require("../models/message-model");
const { getIO } = require("../../socket");

/* =========================================================
   🔹 CREATE INQUIRY
========================================================= */

const createInquiry = async (propertyId, data, user) => {
  try {
    const property = await propertyRepository.getPropertyById(propertyId);

    if (property.status === "Sold") {
      throw new AppError("This property is already sold", 400);
    }

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    let buyerId = user ? user.id : null;

    const existing = await repository.findDuplicateInquiry(
      propertyId,
      buyerId,
      data.buyerEmail
    );

    if (existing) {
      throw new AppError("You have already sent inquiry", 400);
    }

    const agent = property.agent || null;
    const seller = property.seller;

    const inquiry = await repository.createInquiry({
      property: propertyId,
      buyer: buyerId,
      buyerName: data.buyerName || user?.name,
      buyerEmail: data.buyerEmail || user?.email,
      buyerPhone: data.buyerPhone || user?.phone,
      message: data.message,
      seller,
      agent,
    });

    const newMessage = await Message.create({
      inquiry: inquiry._id,
      sender: buyerId || seller,
      senderRole: "Buyer",
      text: data.message,
    });

    const io = getIO();
    io.to(inquiry._id.toString()).emit("new_message", {
      ...newMessage.toObject(),
      inquiry: newMessage.inquiry.toString(),
    });

    try {
      const { subject, html } = inquiryTemplate({
        name: data.buyerName || "User",
        propertyTitle: property.title || "Property",
      });

      await sendEmail({
        to: data.buyerEmail,
        subject,
        html,
      });
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    await propertyRepository.updateProperty(propertyId, {
      $inc: { inquiriesCount: 1 },
    });

    return inquiry;

  } catch (error) {
    console.error("CREATE INQUIRY ERROR:", error);
    throw error;
  }
};

/* =========================================================
   🔹 GET AGENT LEADS
========================================================= */

const getAgentLeads = async (agentId) => {
  return await repository.getAgentLeads(agentId);
};

/* =========================================================
   🔹 GET BUYER INQUIRIES
========================================================= */

const getBuyerInquiries = async (buyerId) => {
  return await repository.getBuyerInquiries(buyerId);
};

/* =========================================================
   🔹 GET BUYER INQUIRY FOR PROPERTY
========================================================= */

const getBuyerInquiryForProperty = async (propertyId, buyerId) => {
  return await repository.getBuyerInquiryForProperty(propertyId, buyerId);
};

/* =========================================================
   🔹 GET BUYER OWNED PROPERTIES 
========================================================= */

const getBuyerOwnedProperties = async (buyerId) => {
  return await repository.getBuyerOwnedProperties(buyerId);
};

/* =========================================================
   🔹 UPDATE LEAD STATUS (UPDATED 🔥)
========================================================= */

const updateLeadStatus = async (inquiryId, status, agentId, dealAmount) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  // 🔐 Only assigned agent
  if (!inquiry.agent) {
    throw new AppError("No agent assigned to this inquiry", 400);
  }

  if (inquiry.agent._id.toString() !== agentId) {
    throw new AppError("Not authorized", 403);
  }

  // 🔁 Allowed transitions
  const allowedTransitions = {
    Pending: ["Seen"],
    Seen: ["Responded"],
    Responded: ["Visit Scheduled"],
    "Visit Scheduled": ["Negotiation"],
    Negotiation: ["Closed Won", "Closed Lost"],
  };

  if (
    allowedTransitions[inquiry.status] &&
    !allowedTransitions[inquiry.status].includes(status)
  ) {
    throw new AppError("Invalid status transition", 400);
  }

  const updateData = { status };

  // ✅ Set closedAt
  if (status === "Closed Won" || status === "Closed Lost") {
    updateData.closedAt = new Date();
  }

  /* =========================================================
     🔥 COMMISSION LOGIC (NEW)
  ========================================================= */

  if (status === "Closed Won") {
    if (!dealAmount) {
      throw new AppError("Deal amount is required", 400);
    }

    const property = inquiry.property;

    let commission = 0;
    let commissionPaidBy = null;

    // 🏠 SALE
    if (property.listingType === "Sale") {
      commission = (dealAmount * 2) / 100;
      commissionPaidBy = "Seller";
    }

    // 🏢 RENT
    if (property.listingType === "Rent") {
      commission = dealAmount; // 1 month rent
      commissionPaidBy = "Buyer";
    }

    const agentEarning = commission * 0.7;
    const platformFee = commission * 0.3;

    // ✅ Update property status
    await propertyRepository.updateProperty(property._id, {
      status: "Sold",
    });

    // ✅ Save revenue data
    updateData.dealAmount = dealAmount;
    updateData.commission = commission;
    updateData.agentEarning = agentEarning;
    updateData.platformFee = platformFee;
    updateData.commissionPaidBy = commissionPaidBy;
  }

  return await repository.updateLeadStatus(inquiryId, updateData);
};

/* =========================================================
   🔹 RESPOND TO INQUIRY
========================================================= */

const respondToInquiry = async (inquiryId, response, agentId) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  if (!inquiry.agent || inquiry.agent._id.toString() !== agentId) {
    throw new AppError("Not authorized", 403);
  }

  const newMessage = await Message.create({
    inquiry: inquiryId,
    sender: agentId,
    senderRole: "Agent",
    text: response,
  });

  const io = getIO();
  io.to(inquiryId.toString()).emit("new_message", {
    ...newMessage.toObject(),
    inquiry: newMessage.inquiry.toString(),
  });

  await repository.updateLeadStatus(inquiryId, {
    status: "Responded",
    respondedAt: new Date(),
    responseBy: "Agent",
  });

  try {
    const { subject, html } = agentResponseTemplate({
      name: inquiry.buyerName,
      propertyTitle: inquiry.property?.title,
      response,
    });

    await sendEmail({
      to: inquiry.buyerEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email error:", err);
  }

  return newMessage;
};

/* =========================================================
   🔹 GET MESSAGES
========================================================= */

const getInquiryMessages = async (inquiryId, userId) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  const isAllowed =
    inquiry.buyer?._id?.toString() === userId ||
    inquiry.agent?._id?.toString() === userId ||
    inquiry.seller?._id?.toString() === userId;

  if (!isAllowed) throw new AppError("Not authorized", 403);

  return await Message.find({ inquiry: inquiryId }).sort({ createdAt: 1 });
};

/* =========================================================
   🔹 SEND MESSAGE
========================================================= */

const sendMessage = async (inquiryId, text, userId) => {
  const inquiry = await inquiryRepository.getInquiryById(inquiryId);

  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  const isAgent = String(inquiry.agent?._id || inquiry.agent) === String(userId);

  if (isAgent && inquiry.status === "Pending") {
    inquiry.status = "Responded";
    inquiry.respondedAt = new Date();
    inquiry.responseBy = "Agent";
  }

  const message = await messageRepository.createMessage({
    inquiry: inquiryId,
    sender: userId,
    text
  });

  await inquiry.save();

  return message;
};

/* =========================================================
   🔹 SCHEDULE VISIT
========================================================= */

const scheduleVisit = async (inquiryId, visitDate, visitTime, agentId) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  if (!inquiry.agent) {
    throw new AppError("No agent assigned to this inquiry", 400);
  }

  if (inquiry.agent._id.toString() !== agentId) {
    throw new AppError("Not authorized", 403);
  }

  const selectedDateTime = new Date(`${visitDate}T${visitTime}`);
  if (selectedDateTime < new Date()) {
    throw new AppError("Cannot schedule visit in the past", 400);
  }

  const updatedInquiry = await repository.updateVisitSchedule(
    inquiryId,
    visitDate,
    visitTime
  );

  await repository.updateLeadStatus(inquiryId, {
    status: "Visit Scheduled",
  });

  try {
    const { subject, html } = visitTemplate({
      name: updatedInquiry.buyerName,
      propertyTitle: updatedInquiry.property?.title,
      date: new Date(visitDate).toLocaleDateString(),
      time: visitTime,
    });

    await sendEmail({
      to: updatedInquiry.buyerEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Visit email failed:", err);
  }

  return updatedInquiry;
};

module.exports = {
  createInquiry,
  getAgentLeads,
  getBuyerInquiries,
  getBuyerInquiryForProperty,
  getBuyerOwnedProperties,
  updateLeadStatus,
  respondToInquiry,
  getInquiryMessages,
  sendMessage,
  scheduleVisit,
};