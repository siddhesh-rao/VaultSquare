const express = require("express");

const {
  getRentalQuote,
  createRental,
  getMyRentals,
  getAllRentals,
  completeRental,
  refundRentalDeposit
} = require("../controllers/rentalController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/quote", protect, getRentalQuote);
router.post("/", protect, createRental);
router.get("/my-rentals", protect, getMyRentals);
router.get("/", protect, adminOnly, getAllRentals);
router.patch("/:id/complete", protect, adminOnly, completeRental);
router.patch("/:id/refund", protect, adminOnly, refundRentalDeposit);

module.exports = router;
