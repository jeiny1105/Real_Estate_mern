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

    // ✅ CREATE MESSAGE
    const newMessage = await Message.create({
      inquiry: inquiry._id,
      sender: buyerId || seller,
      senderRole: "Buyer",
      text: data.message,
    });

    // ✅ EMIT FULL MESSAGE
    const io = getIO();

io.to(inquiry._id.toString()).emit("new_message", {
  ...newMessage.toObject(),
  inquiry: newMessage.inquiry.toString(),
});

    // EMAIL
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
   🔹 UPDATE LEAD STATUS
========================================================= */

const updateLeadStatus = async (inquiryId, status, agentId) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  if (inquiry.agent && inquiry.agent._id.toString() !== agentId) {
    throw new AppError("Not authorized", 403);
  }

  return await repository.updateLeadStatus(inquiryId, status);
};

/* =========================================================
   🔹 RESPOND TO INQUIRY
========================================================= */

const respondToInquiry = async (inquiryId, response, agentId) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  // ✅ CREATE MESSAGE
  const newMessage = await Message.create({
    inquiry: inquiryId,
    sender: agentId,
    senderRole: "Agent",
    text: response,
  });

  // ✅ EMIT FULL MESSAGE
  const io = getIO();
  io.to(inquiryId.toString()).emit("new_message", {
  ...newMessage.toObject(),
  inquiry: newMessage.inquiry.toString(),
});

  await repository.updateLeadStatus(inquiryId, "Responded");

  // EMAIL
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
   🔹 SEND MESSAGE (BUYER CHAT)
========================================================= */

const sendMessage = async (inquiryId, text, userId) => {
  const inquiry = await repository.getInquiryById(inquiryId);

  if (!inquiry) throw new AppError("Inquiry not found", 404);

  const isBuyer = inquiry.buyer?._id?.toString() === userId;

  // ✅ CREATE MESSAGE
  const newMessage = await Message.create({
    inquiry: inquiryId,
    sender: userId,
    senderRole: isBuyer ? "Buyer" : "Agent",
    text,
  });

  console.log("🚀 EMITTING MESSAGE:", newMessage);

  // ✅ EMIT FULL MESSAGE
  const io = getIO();
  io.to(inquiryId.toString()).emit("new_message", {
  ...newMessage.toObject(),
  inquiry: newMessage.inquiry.toString(),
});

  return newMessage;
};

/* =========================================================
   🔹 SCHEDULE VISIT
========================================================= */

const scheduleVisit = async (inquiryId, visitDate, visitTime, agentId) => {
  const updatedInquiry = await repository.updateVisitSchedule(
    inquiryId,
    visitDate,
    visitTime
  );

  try {
    const { subject, html } = visitTemplate({
      name: updatedInquiry.buyerName,
      propertyTitle: updatedInquiry.property?.title,
      date: visitDate,
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
  updateLeadStatus,
  respondToInquiry,
  getInquiryMessages,
  sendMessage,
  scheduleVisit,
};