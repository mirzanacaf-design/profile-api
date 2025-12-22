const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login endpoint
 * Prevents brute force attacks by limiting login attempts
 */
// TODO: Configure rate limiter using rateLimit()
// Set windowMs to 15 minutes (15 * 60 * 1000)
// Set max to 5 attempts per window
// Add custom message: 'Too many login attempts. Please try again after 15 minutes.'
// Set standardHeaders: true and legacyHeaders: false
const loginLimiter = null;

module.exports = { loginLimiter };
