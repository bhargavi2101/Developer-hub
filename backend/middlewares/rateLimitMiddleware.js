const rateLimit = require('express-rate-limit');

// General rate limiter for all routes
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    msg: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for admin users
    if (req.user?.isAdmin) return true;
    return false;
  }
});

// Strict rate limiter for authentication routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    msg: 'Too many authentication attempts, please try again later'
  },
  skipFailedRequests: false,
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for API routes
const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: {
    msg: 'Too many API requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin users
    if (req.user?.isAdmin) return true;
    return false;
  }
});

// Rate limiter for write operations (POST, PUT, DELETE, PATCH)
const writeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 write requests per minute
  message: {
    msg: 'Too many write operations, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin users
    if (req.user?.isAdmin) return true;
    return false;
  }
});

// Rate limiter for search routes
const searchRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: {
    msg: 'Too many search requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalRateLimiter,
  authRateLimiter,
  apiRateLimiter,
  writeRateLimiter,
  searchRateLimiter
};
