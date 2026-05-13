/**
 * File Validation Middleware
 *
 * Validates uploaded files for security, size, and type restrictions
 */

const multer = require('multer');
const path = require('path');

// File size limits (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// File extension validation
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx'];

/**
 * Validate file type
 */
const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

/**
 * Validate file extension
 */
const validateFileExtension = (file, allowedExtensions) => {
  const ext = path.extname(file.originalname).toLowerCase();
  return allowedExtensions.includes(ext);
};

/**
 * Validate file size
 */
const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Sanitize filename
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Generic file validation middleware
 */
const validateFile = (allowedTypes, allowedExtensions, maxSize) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const file = req.file;

    // Validate file type
    if (!validateFileType(file, allowedTypes)) {
      return res.status(400).json({
        msg: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // Validate file extension
    if (!validateFileExtension(file, allowedExtensions)) {
      return res.status(400).json({
        msg: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`
      });
    }

    // Validate file size
    if (!validateFileSize(file, maxSize)) {
      return res.status(400).json({
        msg: `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`
      });
    }

    // Sanitize filename
    file.originalname = sanitizeFilename(file.originalname);

    next();
  };
};

/**
 * Avatar-specific validation
 */
const validateAvatar = validateFile(ALLOWED_AVATAR_TYPES, ALLOWED_IMAGE_EXTENSIONS, MAX_AVATAR_SIZE);

/**
 * Image validation
 */
const validateImage = validateFile(ALLOWED_IMAGE_TYPES, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE);

/**
 * Document validation
 */
const validateDocument = validateFile(ALLOWED_DOCUMENT_TYPES, ALLOWED_DOCUMENT_EXTENSIONS, MAX_FILE_SIZE);

/**
 * Multer configuration for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';

    // Determine upload path based on file type
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype === 'application/pdf') {
      uploadPath += 'documents/';
    } else {
      uploadPath += 'files/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const sanitizedName = sanitizeFilename(file.originalname.replace(ext, ''));
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

/**
 * Multer upload configuration
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    // Allow all files here, validation will be done by middleware
    cb(null, true);
  }
});

/**
 * Single file upload middleware
 */
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            msg: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
          });
        }
        return res.status(400).json({ msg: err.message });
      } else if (err) {
        return res.status(500).json({ msg: 'File upload error' });
      }
      next();
    });
  };
};

/**
 * Multiple files upload middleware
 */
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            msg: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            msg: `Maximum ${maxCount} files allowed`
          });
        }
        return res.status(400).json({ msg: err.message });
      } else if (err) {
        return res.status(500).json({ msg: 'File upload error' });
      }
      next();
    });
  };
};

module.exports = {
  validateAvatar,
  validateImage,
  validateDocument,
  validateFile,
  uploadSingle,
  uploadMultiple,
  sanitizeFilename,
  MAX_FILE_SIZE,
  MAX_AVATAR_SIZE,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_AVATAR_TYPES,
  ALLOWED_DOCUMENT_TYPES
};