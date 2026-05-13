const logger = require('../utils/logger');
const Security = require('../utils/security');

const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred', err, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      msg: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      msg: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      msg: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      msg: 'Token expired'
    });
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      msg: 'Invalid ID format'
    });
  }

  // Security errors
  if (err.name === 'SecurityError') {
    logger.warn('Security violation detected', {
      ip: req.ip,
      message: err.message
    });
    return res.status(403).json({
      msg: 'Security violation detected'
    });
  }

  // Rate limit errors
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      msg: err.message || 'Too many requests'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  // Don't expose sensitive errors in production
  const response = {
    msg: message,
    errorId: Security.generateToken(8) // For debugging
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Not found handler
const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    msg: 'Route not found'
  });
};

// Async handler wrapper to catch errors in async routes
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
