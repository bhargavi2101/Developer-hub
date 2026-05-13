const sanitizeHtml = require('sanitize-html');
const { body, validationResult } = require('express-validator');

// HTML sanitization options
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false
};

// Middleware to sanitize request body
const sanitizeBody = (fields = []) => {
  return (req, res, next) => {
    try {
      // If no specific fields provided, sanitize all string fields
      const fieldsToSanitize = fields.length > 0 ? fields : Object.keys(req.body);

      fieldsToSanitize.forEach(field => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          req.body[field] = sanitizeHtml(req.body[field], sanitizeOptions);
        }
      });

      next();
    } catch (error) {
      console.error('Sanitize body error:', error);
      next();
    }
  };
};

// Middleware to sanitize query parameters
const sanitizeQuery = (fields = []) => {
  return (req, res, next) => {
    try {
      // If no specific fields provided, sanitize all string fields
      const fieldsToSanitize = fields.length > 0 ? fields : Object.keys(req.query);

      fieldsToSanitize.forEach(field => {
        if (req.query[field] && typeof req.query[field] === 'string') {
          req.query[field] = sanitizeHtml(req.query[field], {
            allowedTags: [],
            allowedAttributes: {}
          });
        }
      });

      next();
    } catch (error) {
      console.error('Sanitize query error:', error);
      next();
    }
  };
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
const validationRules = {
  username: body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),

  email: body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  name: body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be 1-100 characters'),

  content: body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be 1-5000 characters'),

  title: body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be 1-200 characters'),

  description: body('description')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
};

// XSS protection middleware
const xssProtection = (req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
};

// SQL injection protection for MongoDB
const mongoSanitize = (req, res, next) => {
  try {
    const sanitize = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;

      const sanitized = Array.isArray(obj) ? [] : {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Skip $ and . keys to prevent MongoDB injection
          if (key.startsWith('$') || key.includes('.')) {
            continue;
          }
          sanitized[key] = sanitize(obj[key]);
        }
      }

      return sanitized;
    };

    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);

    next();
  } catch (error) {
    console.error('Mongo sanitize error:', error);
    next();
  }
};

module.exports = {
  sanitizeBody,
  sanitizeQuery,
  validateRequest,
  validationRules,
  xssProtection,
  mongoSanitize
};
