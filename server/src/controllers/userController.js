const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (typeof req.body.walletAddress === "string") {
    user.walletAddress = req.body.walletAddress;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      walletAddress: updatedUser.walletAddress,
      role: updatedUser.role
    }
  });
});

module.exports = {
  getProfile,
  updateProfile
};
