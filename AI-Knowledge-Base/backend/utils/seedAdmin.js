/**
 * One-off script to create the first admin user.
 * Run with: npm run seed:admin
 * Configure the email/password via env vars or edit below before running.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Admin";

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} (change this password after first login)`);
  process.exit(0);
})();
