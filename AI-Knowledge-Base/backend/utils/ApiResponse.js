/**
 * Standardized success response shape so the frontend can rely on a
 * consistent { success, message, data } contract from every endpoint.
 */
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
