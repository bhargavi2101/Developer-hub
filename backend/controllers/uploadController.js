const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const User = require('../models/User');

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate cryptographically secure unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    // Only allow single extension
    const safeExt = ext.replace(/\./g, '.').replace(/^\.+/, '.');
    cb(null, `${uniqueSuffix}${safeExt}`);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Additional validation: check actual file signature
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

  if (extname && isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Reduced to 2MB for security
    files: 1 // Only allow one file at a time
  },
  fileFilter: fileFilter
});

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Delete old avatar if exists and is not default
    const user = await User.findById(userId);
    if (user && user.avatar && user.avatar !== '' && user.avatar !== '/uploads/avatars/default-avatar.png') {
      try {
        const oldAvatarPath = path.join(process.cwd(), user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      } catch (err) {
        console.log('Error deleting old avatar:', err);
      }
    }

    // Update user's avatar
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    res.status(200).json({
      msg: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl
    });
  } catch (error) {
    console.log('Upload avatar error:', error);
    res.status(500).json({ msg: 'Server error during avatar upload' });
  }
};

// Upload middleware for single file
const uploadSingle = upload.single('avatar');

module.exports = {
  uploadAvatar,
  uploadSingle
};