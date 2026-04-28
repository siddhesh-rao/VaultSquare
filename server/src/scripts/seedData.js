require("dotenv").config({ path: "./.env" });

const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const sampleProducts = require("../data/sampleProducts");

const seedData = async () => {
  await connectDB();

  await User.deleteMany();
  await Product.deleteMany();

  const adminUser = await User.create({
    name: process.env.ADMIN_NAME || "Admin User",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "admin"
  });

  const regularUser = await User.create({
    name: "Jane Customer",
    email: "jane@example.com",
    password: "Password@123",
    role: "user"
  });

  await Product.insertMany(sampleProducts);

  console.log("Database seeded successfully");
  console.log(`Admin login: ${adminUser.email} / ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
  console.log(`User login: ${regularUser.email} / Password@123`);
  process.exit(0);
};

seedData().catch((error) => {
  console.error("Failed to seed data", error);
  process.exit(1);
});
