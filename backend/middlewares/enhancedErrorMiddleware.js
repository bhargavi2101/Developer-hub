/**
 * Enhanced Error Handling Middleware
 *
 * Provides comprehensive error handling with logging, user-friendly messages,
 * and proper HTTP status codes
 */

const fs = require('fs');
const path = require('path');

// Error types
const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  CONFLICT_ERROR: 'ConflictError',
  RATE_LIMIT_ERROR: 'RateLimitError',
  SERVER_ERROR: 'ServerError',
  DATABASE_ERROR: 'DatabaseError'
};

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, type, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, ErrorTypes.VALIDATION_ERROR, details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, ErrorTypes.AUTHENTICATION_ERROR);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, ErrorTypes.AUTHORIZATION_ERROR);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, ErrorTypes.NOT_FOUND_ERROR);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, ErrorTypes.CONFLICT_ERROR);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429, ErrorTypes.RATE_LIMIT_ERROR);
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, ErrorTypes.DATABASE_ERROR);
  }
}

/**
 * Error logger
 */
const errorLogger = (error, req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      type: error.type || 'UnknownError',
      statusCode: error.statusCode || 500,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    request: {
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type']
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body).substring(0, 500) : undefined,
      query: req.query,
      params: req.params
    },
    user: req.user ? { id: req.user.id, username: req.user.username } : undefined
  };

  // Log to console
  console.error('🚨 Error:', JSON.stringify(logData, null, 2));

  // Log to file if in production
  if (process.env.NODE_ENV === 'production') {
    const logFilePath = path.join(__dirname, '../logs/errors.log');
    const logLine = JSON.stringify(logData) + '\n';

    fs.appendFile(logFilePath, logLine, (err) => {
      if (err) console.error('Failed to write error log:', err);
    });
  }

  next(error);
};

/**
 * Error handler
 */
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let type = error.type || ErrorTypes.SERVER_ERROR;
  let details = error.details || {};

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    type = ErrorTypes.VALIDATION_ERROR;
    message = 'Validation failed';
    details = error.errors;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    type = ErrorTypes.VALIDATION_ERROR;
    message = 'Invalid data format';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    type = ErrorTypes.AUTHENTICATION_ERROR;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    type = ErrorTypes.AUTHENTICATION_ERROR;
    message = 'Token expired';
  } else if (error.code === 11000) {
    statusCode = 409;
    type = ErrorTypes.CONFLICT_ERROR;
    message = 'Duplicate entry';
    const field = Object.keys(error.keyPattern)[0];
    details = { field, value: error.keyValue[field] };
  } else if (error.name === 'MongoError' && error.code === 11000) {
    statusCode = 409;
    type = ErrorTypes.CONFLICT_ERROR;
    message = 'Duplicate entry';
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      type,
      message,
      details
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: ErrorTypes.NOT_FOUND_ERROR,
      message: `Route ${req.method} ${req.url} not found`,
      details: {
        method: req.method,
        url: req.url
      }
    }
  });
};

/**
 * Async handler wrapper to catch async errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation error handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = [];

  if (req.validationErrors) {
    req.validationErrors.forEach(error => {
      errors.push({
        field: error.param,
        message: error.msg,
        value: error.value
      });
    });

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', { errors });
    }
  }

  next();
};

module.exports = {
  errorHandler,
  errorLogger,
  notFoundHandler,
  asyncHandler,
  handleValidationErrors,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ErrorTypes
};