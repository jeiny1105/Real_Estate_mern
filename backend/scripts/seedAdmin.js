require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/api/models/user-model"); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Super Admin";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "9999999999";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to database");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
      isDeleted: false,
    });

    if (existingAdmin) {
      console.log("⚠ Admin already exists");
      process.exit(0);
    }

    // Hash password (12 rounds recommended for production)
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      password: hashedPassword,
      role: "Admin",
      status: "Active",
      profileImage: null,
      tenant: null,
      isDeleted: false,
    });

    console.log("🚀 Admin seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
};

seedAdmin();