const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getQuiz,
  submitQuiz,
  getUserQuizResults,
  getQuizStatistics,
  getBestResults
} = require('../controllers/quizController');

// Submit quiz answers (must come before :subTechnologyId route)
router.post('/:quizId/submit', authMiddleware, submitQuiz);

// Get quiz statistics (must come before :subTechnologyId route)
router.get('/statistics', authMiddleware, getQuizStatistics);

// Get user's best results (must come before :subTechnologyId route)
router.get('/best', authMiddleware, getBestResults);

// Get user's quiz results
router.get('/', authMiddleware, getUserQuizResults);

// Get quiz for a sub-technology
router.get('/:subTechnologyId', authMiddleware, getQuiz);

module.exports = router;