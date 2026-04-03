const Razorpay = require("razorpay");
const SubscriptionPlan = require("../../api/models/subscriptionPlan-model");
const crypto = require("crypto");

/* 🔹 Initialize Razorpay */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order (Seller / Agent)
 */
const createOrder = async ({
  subscriptionPlanId,
  role,
  customAmount = null,
}) => {
  const plan = await SubscriptionPlan.findOne({
    _id: subscriptionPlanId,
    status: "Active",
    isDeleted: false,
  });

  if (!plan) {
    const err = new Error("Subscription plan not found or inactive");
    err.statusCode = 404;
    throw err;
  }

  if (plan.planFor !== "Both" && plan.planFor !== role) {
    const err = new Error(`This plan is not applicable for ${role}`);
    err.statusCode = 400;
    throw err;
  }

  // 🔹 Use custom amount if provided (upgrade case)
  const finalAmount = customAmount !== null
    ? customAmount
    : plan.pricing.price;

  const amountInPaise = Math.round(finalAmount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    plan: {
      id: plan._id,
      name: plan.name,
      durationInDays: plan.pricing.durationInDays,
      price: finalAmount, // return charged amount
    },
  };
};

/**
 * Verify Razorpay payment signature
 */
const verifySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

module.exports = {
  createOrder,
  verifySignature,
};
