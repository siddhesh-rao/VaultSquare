const User = require("../models/User");
const Product = require("../models/Product");
const sampleProducts = require("../data/sampleProducts");

const bootstrapData = async () => {
  if (process.env.AUTO_BOOTSTRAP_DATA === "false") {
    console.log("Automatic bootstrap disabled");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin"
    });
    console.log(`Bootstrap created admin user: ${adminEmail}`);
  }

  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Bootstrap inserted ${sampleProducts.length} sample products`);
  }
};

module.exports = bootstrapData;
