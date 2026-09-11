const rateLimit = require("express-rate-limit");

// Tight limit on login/register specifically — these are the endpoints
// brute-force and credential-stuffing attempts actually target.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in a few minutes." },
});

// Looser general limit so normal browsing/shopping never gets caught by it,
// but a scripted flood of requests still gets throttled.
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});

module.exports = { authLimiter, generalLimiter };
