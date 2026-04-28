const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  walletAddress: user.walletAddress,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: sanitizeUser(user),
    token: generateToken({ id: user._id })
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    message: "Login successful",
    user: sanitizeUser(user),
    token: generateToken({ id: user._id })
  });
});

module.exports = {
  registerUser,
  loginUser
};
