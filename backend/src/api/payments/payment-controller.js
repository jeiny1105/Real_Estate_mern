const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const paymentService = require("./payment-service");
const Payment = require("../models/payment-model");
const SubscriptionPlan = require("../models/subscriptionPlan-model");
const subscriptionService = require("../subscription/subscription-service");
const invoiceService = require("./invoice-service");
const User = require("../models/user-model");

const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/app-error");

/**
 * Create Razorpay order for Seller
 */
const createSellerOrder = asyncHandler(async (req, res) => {
  const { subscriptionPlanId } = req.body;

  if (!subscriptionPlanId) {
    throw new AppError("Subscription plan is required", 400);
  }

  const orderData = await paymentService.createOrder({
    subscriptionPlanId,
    role: "Seller",
  });

  return res.status(200).json({
    success: true,
    data: orderData,
  });
});

/**
 * Create Razorpay order for Agent
 */
const createAgentOrder = asyncHandler(async (req, res) => {
  const { subscriptionPlanId } = req.body;

  if (!subscriptionPlanId) {
    throw new AppError("Subscription plan is required", 400);
  }

  const orderData = await paymentService.createOrder({
    subscriptionPlanId,
    role: "Agent",
  });

  return res.status(200).json({
    success: true,
    data: orderData,
  });
});

/**
 * Verify Razorpay payment and activate subscription
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscriptionPlanId,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !subscriptionPlanId
  ) {
    throw new AppError("Incomplete payment verification data", 400);
  }

  // 1️⃣ Verify signature
  const isValid = paymentService.verifySignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    throw new AppError("Invalid payment signature", 400);
  }

  // 2️⃣ Fetch plan
  const plan = await SubscriptionPlan.findOne({
    _id: subscriptionPlanId,
    status: "Active",
    isDeleted: false,
  });

  if (!plan) {
    throw new AppError("Subscription plan not found or inactive", 404);
  }

  const userId = req.user.id;

  // 3️⃣ Calculate subscription period
  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(
    startDate.getDate() + plan.pricing.durationInDays
  );

  // 4️⃣ Create Payment record
  const payment = await Payment.create({
    user: userId,
    userRole: req.user.role,
    type: "Initial",
    subscriptionPlan: plan._id,
    amount: plan.pricing.price,
    currency: "INR",
    gateway: "Razorpay",
    transactionId: razorpay_payment_id,
    status: "Success",
    subscriptionStart: startDate,
    subscriptionExpiry: expiryDate,
  });

  const user = await User.findById(userId);

  const invoice = await invoiceService.generateInvoice(
    payment,
    user,
    plan
  );

  payment.invoiceNumber = invoice.invoiceNumber;
  payment.invoicePath = invoice.invoicePath;

  await payment.save();

  // 5️⃣ Activate subscription
  await subscriptionService.activateSubscription(
    userId,
    subscriptionPlanId
  );

  return res.status(200).json({
    success: true,
    message: "Payment verified and subscription activated",
  });
});

/** Razorpay Webhook  */

const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new AppError("Invalid webhook signature", 400);
  }

  const event = JSON.parse(req.body.toString());

  console.log("Razorpay Event:", event.event);

  res.status(200).json({ received: true });
});

/** Download Invoice */

const downloadInvoice = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findOne({
    _id: paymentId,
    user: req.user.id,
    isDeleted: false,
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (!payment.invoicePath) {
    throw new AppError("Invoice not available", 404);
  }

  const filePath = path.join(
    process.cwd(),
    payment.invoicePath
  );

  if (!fs.existsSync(filePath)) {
    throw new AppError("Invoice file missing on server", 404);
  }

  res.download(filePath, `${payment.invoiceNumber}.pdf`);
});

/** Get current user's payments */

const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    user: req.user.id,
    isDeleted: false,
  })
    .populate("subscriptionPlan", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: payments,
  });
});

module.exports = {
  createSellerOrder,
  createAgentOrder,
  verifyPayment,
  razorpayWebhook,
  downloadInvoice,
  getMyPayments,
};