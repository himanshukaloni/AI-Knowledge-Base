const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

/**
 * Centralized error-handling middleware. Every thrown error (via ApiError
 * or asyncHandler-caught rejections) ends up here so responses are
 * consistently shaped and errors are consistently logged.
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Normalize non-ApiError errors (e.g. Mongoose validation, JSON parse errors)
  if (!(err instanceof ApiError)) {
    statusCode = err.name === "ValidationError" ? 400 : 500;
    message = statusCode === 500 ? "Internal server error" : err.message;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode || 500).json({
    success: false,
    message: message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    ...(err.details && { details: err.details }),
  });
};

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

module.exports = { errorHandler, notFound };
