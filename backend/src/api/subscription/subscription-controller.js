const subscriptionService = require("./subscription-service");
const paymentService = require("../payments/payment-service");
const Payment = require("../models/payment-model");
const AppError = require("../../utils/app-error");
const User = require("../models/user-model");
const SubscriptionPlan = require("../models/subscriptionPlan-model");
const invoiceService = require("../payments/invoice-service");
const asyncHandler = require("../../utils/asyncHandler");

/**
 * Initiate Upgrade
 */
const initiateUpgrade = asyncHandler(async (req, res) => {
  const { newPlanId } = req.body;
  const userId = req.user.id;

  const upgradeData = await subscriptionService.initiateUpgrade(
    userId,
    newPlanId
  );

  const order = await paymentService.createOrder({
    subscriptionPlanId: newPlanId,
    role: req.user.role,
    customAmount: upgradeData.payableAmount,
  });

  return res.status(200).json({
    success: true,
    message: "Upgrade initiated",
    proration: upgradeData,
    order,
  });
});

/**
 * Verify Upgrade Payment
 */
const verifyUpgradePayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    newPlanId,
  } = req.body;

  /* 🔐 Verify Razorpay signature */
  const isValid = paymentService.verifySignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    throw new AppError("Invalid payment signature", 400);
  }

  const userId = req.user.id;

  /* 🔁 Prevent duplicate payment */
  const existingPayment = await Payment.findOne({
    transactionId: razorpay_payment_id,
  });

  if (existingPayment) {
    return res.status(200).json({
      success: true,
      message: "Payment already processed",
    });
  }

  /* 🔄 Recalculate proration (security) */
  const upgradeData = await subscriptionService.initiateUpgrade(
    userId,
    newPlanId
  );

  const payableAmount = upgradeData.payableAmount;

  /* 💾 Create payment record */
  const payment = await Payment.create({
    user: userId,
    userRole: req.user.role,
    type: "Upgrade",
    subscriptionPlan: newPlanId,
    amount: payableAmount,
    currency: "INR",
    gateway: "Razorpay",
    transactionId: razorpay_payment_id,
    status: "Success",
    subscriptionStart: new Date(),
    subscriptionExpiry: null,
  });

  /* 🔍 Fetch user & plan */
  const user = await User.findById(userId);
  const plan = await SubscriptionPlan.findById(newPlanId);

  if (!user || !plan) {
    throw new AppError("User or Plan not found", 404);
  }

  /* 🧾 Generate invoice */
  const invoice = await invoiceService.generateInvoice(
    payment,
    user,
    plan
  );

  payment.invoiceNumber = invoice.invoiceNumber;
  payment.invoicePath = invoice.invoicePath;

  await payment.save();

  /* 🚀 Complete upgrade */
  await subscriptionService.completeUpgrade(userId, newPlanId);

  return res.status(200).json({
    success: true,
    message: "Subscription upgraded successfully",
  });
});

/**
 * Cancel Subscription
 */
const cancelSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await subscriptionService.cancelSubscription(userId);

  return res.status(200).json({
    success: true,
    message: result.message,
    expiryDate: result.expiryDate,
  });
});

/**
 * Enable Auto Renew
 */
const enableAutoRenew = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await subscriptionService.enableAutoRenew(userId);

  return res.status(200).json({
    success: true,
    message: result.message,
    expiryDate: result.expiryDate,
  });
});

module.exports = {
  initiateUpgrade,
  verifyUpgradePayment,
  cancelSubscription,
  enableAutoRenew,
};