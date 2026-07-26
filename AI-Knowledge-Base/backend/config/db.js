const mongoose = require("mongoose");
const logger = require("./logger");

/**
 * Connects to MongoDB Atlas.
 * Must be an Atlas cluster (not local mongod) because Atlas Vector Search
 * ($vectorSearch aggregation stage) is an Atlas-only feature.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
