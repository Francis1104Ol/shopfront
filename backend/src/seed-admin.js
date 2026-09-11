// Run once to create an admin login: npm run seed:admin
// Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env, or falls back to defaults below.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("./models/User");

async function seed() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@shopfront.dev").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const name = process.env.ADMIN_NAME || "Store Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const password_hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password_hash, role: "admin" });
  console.log(`✅ Admin created — email: ${email}  password: ${password}`);
  console.log("   (Change this password after first login in a real deployment.)");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
