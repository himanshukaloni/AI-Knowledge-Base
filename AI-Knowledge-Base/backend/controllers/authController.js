const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateToken } = require("../services/tokenService");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json(new ApiResponse(201, { user, token }, "Account created successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated");
  }

  const token = generateToken(user._id);
  res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  await user.save();

  res.status(200).json(new ApiResponse(200, { user }, "Profile updated"));
});

module.exports = { register, login, getProfile, updateProfile };
