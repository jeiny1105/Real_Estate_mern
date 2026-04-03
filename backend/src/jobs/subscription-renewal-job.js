const cron = require("node-cron");
const User = require("../api/models/user-model");
const SubscriptionPlan = require("../api/models/subscriptionPlan-model");
const Payment = require("../api/models/payment-model");
const invoiceService = require("../api/payments/invoice-service");

const renewSubscriptions = async () => {
    try {
        const now = new Date();

        await User.updateMany(
            {
                "subscription.status": "Active",
                "subscription.autoRenew": false,
                "subscription.expiryDate": { $lte: now }
            },
            {
                $set: { "subscription.status": "Expired" }
            }
        );

        const users = await User.find({
            "subscription.status": "Active",
            "subscription.autoRenew": true,
            "subscription.expiryDate": { $lte: now },
        });

        for (const user of users) {
            const plan = await SubscriptionPlan.findById(
                user.subscription.plan
            );

            if (!plan) continue;

            const startDate = new Date();
            const expiryDate = new Date();

            expiryDate.setDate(
                startDate.getDate() + plan.pricing.durationInDays
            );

            // Extend subscription
            user.subscription.startDate = startDate;
            user.subscription.expiryDate = expiryDate;

            await user.save();

            // Record renewal payment
            const payment = await Payment.create({
                user: user._id,
                userRole: user.role,
                type: "Renewal",
                subscriptionPlan: plan._id,
                amount: plan.pricing.price,
                currency: "INR",
                gateway: "AutoRenew",
                transactionId: `renew_${Date.now()}_${user._id}`,
                status: "Success",
                subscriptionStart: startDate,
                subscriptionExpiry: expiryDate,
            });

            const invoice = await invoiceService.generateInvoice(
                payment,
                user,
                plan
            );

            payment.invoiceNumber = invoice.invoiceNumber;
            payment.invoicePath = invoice.invoicePath;

            await payment.save();

            console.log(`Subscription renewed for user ${user._id}`);
        }

    } catch (error) {
        console.error("Subscription renewal job error:", error);
    }
};

/* Run every day at midnight */
cron.schedule("0 0 * * *", () => {
    renewSubscriptions();
});

module.exports = renewSubscriptions;