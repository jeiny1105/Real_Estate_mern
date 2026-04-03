const cron = require("node-cron");
const Property = require("../api/models/property-model");

const expireListings = async () => {
  try {
    const now = new Date();

    const result = await Property.updateMany(
      {
        status: "Available",
        isDeleted: false,
        "subscription.listingExpiry": { $lt: now },
      },
      {
        $set: { status: "Inactive" },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `Expired ${result.modifiedCount} properties at ${now}`
      );
    }
  } catch (error) {
    console.error("Property expiry job error:", error);
  }
};

/* 🔁 Run every 30 minutes */
cron.schedule("*/30 * * * *", () => {
  expireListings();
});

module.exports = expireListings;