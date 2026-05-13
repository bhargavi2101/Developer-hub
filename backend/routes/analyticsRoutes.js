const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getLearningPatterns,
  getProgressTimeline,
  getDetailedStatistics,
  getLeaderboard,
  trackLearningSession
} = require('../controllers/analyticsController');

// User analytics
router.get('/learning-patterns', authMiddleware, getLearningPatterns);
router.get('/progress-timeline', authMiddleware, getProgressTimeline);
router.get('/detailed-statistics', authMiddleware, getDetailedStatistics);
router.get('/leaderboard', getLeaderboard);

// Session tracking
router.post('/session', authMiddleware, trackLearningSession);

module.exports = router;
