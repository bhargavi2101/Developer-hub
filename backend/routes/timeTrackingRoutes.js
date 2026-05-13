const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  startSession,
  endSession,
  getTimeAnalytics,
  getTimeBasedStreaks
} = require('../controllers/timeTrackingController');

// Start learning session
router.post('/session/start', authMiddleware, startSession);

// End learning session
router.post('/session/end', authMiddleware, endSession);

// Get learning time analytics
router.get('/analytics', authMiddleware, getTimeAnalytics);

// Get time-based streaks and goals
router.get('/streaks', authMiddleware, getTimeBasedStreaks);

module.exports = router;