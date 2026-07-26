const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * Runs after express-validator's chain of checks (in route files) and
 * throws a formatted 400 error if any validation failed.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw new ApiError(400, "Validation failed", details);
  }
  next();
};

module.exports = validateRequest;
