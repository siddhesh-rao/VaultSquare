const Product = require("../models/Product");
const Rental = require("../models/Rental");
const asyncHandler = require("../utils/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const filter = {
    isActive: true
  };

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  if (req.query.category && req.query.category !== "All") {
    filter.category = req.query.category;
  }

  const [products, categories] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }),
    Product.distinct("category", { isActive: true })
  ]);

  res.json({
    success: true,
    count: products.length,
    products,
    categories: ["All", ...categories.sort()]
  });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    product
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  const updatedProduct = await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: "Product archived successfully"
  });
});

const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const productId = req.params.id;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required");
  }

  const overlappingRental = await Rental.findOne({
    product: productId,
    status: { $in: ["reserved", "active"] },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  });

  res.json({
    success: true,
    available: !overlappingRental
  });
});

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  checkAvailability
};
