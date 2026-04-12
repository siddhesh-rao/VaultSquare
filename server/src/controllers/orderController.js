const Order = require("../models/Order");
const Product = require("../models/Product");
const Rental = require("../models/Rental");
const asyncHandler = require("../utils/asyncHandler");

const createBuyOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Order items are required");
  }

  const normalizedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();

    normalizedItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      quantity: item.quantity,
      price: product.buyPrice
    });

    totalAmount += product.buyPrice * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    orderType: "buy",
    totalAmount,
    status: "paid",
    shippingAddress
  });

  res.status(201).json({
    success: true,
    message: "Buy order created successfully",
    order
  });
});

const createRentOrder = asyncHandler(async (req, res) => {
  const { rentalId, transactionHash } = req.body;

  const rental = await Rental.findById(rentalId).populate("product");

  if (!rental) {
    res.status(404);
    throw new Error("Rental not found");
  }

  const order = await Order.create({
    user: req.user._id,
    items: [
      {
        product: rental.product._id,
        name: rental.product.name,
        image: rental.product.image,
        quantity: 1,
        price: rental.totalAmount
      }
    ],
    orderType: "rent",
    totalAmount: rental.totalAmount,
    status: "active",
    rental: rental._id,
    transactionHash
  });

  rental.status = "active";
  await rental.save();

  res.status(201).json({
    success: true,
    message: "Rent order created successfully",
    order
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("rental")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("rental")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

module.exports = {
  createBuyOrder,
  createRentOrder,
  getMyOrders,
  getAllOrders
};
