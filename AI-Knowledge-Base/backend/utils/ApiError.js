/**
 * Standardized error class thrown across controllers/services.
 * Caught by the centralized errorHandler middleware.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes expected errors from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
