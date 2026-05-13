const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateUserPreferences,
  getPublicUserProfile,
  searchUsers
} = require('../controllers/userController');

// Get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile
router.put('/profile', authMiddleware, updateUserProfile);

// Update user preferences
router.put('/preferences', authMiddleware, updateUserPreferences);

// Change password
router.put('/change-password', authMiddleware, changePassword);

// Get public user profile (accessible to all)
router.get('/:username', getPublicUserProfile);

// Search users
router.get('/search/users', searchUsers);

module.exports = router;
