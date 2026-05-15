const { body, validationResult } = require('express-validator');

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

// Password strength validator
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize user input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .substring(0, 1000); // Limit length
};

// Sanitize HTML content (for posts, comments, etc.)
const sanitizeHtml = (html) => {
  const sanitize = require('sanitize-html');
  return sanitize(html, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
    allowedAttributes: {
      'a': ['href', 'title'],
      'code': ['class']
    },
    allowedIframeHostnames: []
  });
};

module.exports = {
  validateRequest,
  validatePassword,
  sanitizeInput,
  sanitizeHtml,
  registrationRules: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom((value) => {
        const validation = validatePassword(value);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }
        return true;
      })
  ],
  loginRules: [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  contentRules: [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 5000 })
      .withMessage('Content must be less than 5000 characters')
  ],
  commentRules: [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ max: 1000 })
      .withMessage('Comment must be less than 1000 characters')
  ]
};