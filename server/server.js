require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const bootstrapData = require("./src/scripts/bootstrapData");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await bootstrapData();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
