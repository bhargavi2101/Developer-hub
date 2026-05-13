const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getAllBadges,
  getUserBadges,
  getUserBadgeProgress,
  triggerAchievementCheck
} = require('../controllers/badgeController');

// Get all available badges (public)
router.get('/', getAllBadges);

// Get user's earned badges (protected)
router.get('/user', authMiddleware, getUserBadges);

// Get user's badge progress (protected)
router.get('/progress', authMiddleware, getUserBadgeProgress);

// Manually trigger achievement check (protected)
router.post('/check', authMiddleware, triggerAchievementCheck);

module.exports = router;