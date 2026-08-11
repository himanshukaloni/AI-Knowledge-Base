const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Not authorized, token invalid or expired");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Not authorized, user no longer exists or is deactivated");
  }

  req.user = user;
  next();
});

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "You do not have permission to perform this action");
  }
  next();
};

module.exports = { protect, authorize };
