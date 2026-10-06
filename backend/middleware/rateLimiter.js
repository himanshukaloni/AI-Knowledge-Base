const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
  },
});

const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return req.user._id.toString();
  },

  message: {
    success: false,
    message:
      "Daily AI limit reached. You can send only 5 AI messages every 24 hours.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
};