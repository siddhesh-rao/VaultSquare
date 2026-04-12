const Product = require("../models/Product");
const Rental = require("../models/Rental");
const asyncHandler = require("../utils/asyncHandler");
const {
  createRentalAgreement,
  releasePayment,
  refundDeposit
} = require("../services/blockchainService");

const calculateRentalSummary = (product, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid rental dates");
  }

  if (end < start) {
    throw new Error("End date cannot be earlier than start date");
  }

  const timeDiff = end.getTime() - start.getTime();
  const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  const rentalAmount = totalDays * product.rentPricePerDay;
  const depositAmount =
    product.depositAmount ||
    Number(process.env.DEFAULT_RENTAL_DEPOSIT_RATE || 0.2) * product.buyPrice;

  return {
    totalDays,
    rentalAmount,
    depositAmount,
    totalAmount: rentalAmount + depositAmount
  };
};

const getRentalQuote = asyncHandler(async (req, res) => {
  const { productId, startDate, endDate } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const quote = calculateRentalSummary(product, startDate, endDate);

  res.json({
    success: true,
    quote
  });
});

const createRental = asyncHandler(async (req, res) => {
  const { productId, startDate, endDate } = req.body;
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found");
  }

  const overlappingRental = await Rental.findOne({
    product: productId,
    status: { $in: ["reserved", "active"] },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  });

  if (overlappingRental) {
    res.status(400);
    throw new Error("Product is not available for the selected dates");
  }

  if (!req.user.walletAddress) {
    res.status(400);
    throw new Error("Please link a wallet address before creating a rental");
  }

  const summary = calculateRentalSummary(product, startDate, endDate);

  const rental = await Rental.create({
    user: req.user._id,
    product: product._id,
    startDate,
    endDate,
    ...summary
  });

  let chainResult = {
    agreementId: "",
    transactionHash: ""
  };
  const ownerAddress = req.body.ownerAddress || process.env.PLATFORM_WALLET_ADDRESS;

  try {
    chainResult = await createRentalAgreement({
      renterAddress: req.user.walletAddress,
      ownerAddress,
      productId: String(product._id),
      startDate,
      endDate,
      depositAmount: summary.depositAmount
    });
  } catch (error) {
    console.error("Blockchain agreement creation failed:", error.message);
  }

  rental.agreementId = chainResult.agreementId;
  rental.transactionHash = chainResult.transactionHash;
  await rental.save();

  res.status(201).json({
    success: true,
    message: "Rental created successfully",
    rental
  });
});

const getMyRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ user: req.user._id })
    .populate("product")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    rentals
  });
});

const getAllRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find()
    .populate("user", "name email")
    .populate("product")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    rentals
  });
});

const completeRental = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error("Rental not found");
  }

  if (rental.agreementId) {
    await releasePayment(rental.agreementId);
  }

  rental.status = "completed";
  await rental.save();

  res.json({
    success: true,
    message: "Rental marked as completed",
    rental
  });
});

const refundRentalDeposit = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error("Rental not found");
  }

  if (rental.agreementId) {
    await refundDeposit(rental.agreementId);
  }

  rental.status = "deposit_refunded";
  await rental.save();

  res.json({
    success: true,
    message: "Deposit refunded successfully",
    rental
  });
});

module.exports = {
  getRentalQuote,
  createRental,
  getMyRentals,
  getAllRentals,
  completeRental,
  refundRentalDeposit
};
