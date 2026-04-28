const express = require("express");

const {
  createBuyOrder,
  createRentOrder,
  getMyOrders,
  getAllOrders
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/buy", protect, createBuyOrder);
router.post("/rent", protect, createRentOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);

module.exports = router;
