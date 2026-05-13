const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getPerformanceMetrics,
  logPerformanceEvent,
  getPerformanceReport
} = require('../controllers/performanceController');

// Get current performance metrics
router.get('/metrics', authMiddleware, getPerformanceMetrics);

// Log custom performance event
router.post('/log-event', authMiddleware, logPerformanceEvent);

// Get performance report with recommendations
router.get('/report', authMiddleware, getPerformanceReport);

module.exports = router;