const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getUserRoadmaps,
  getUserStatistics,
  createUserRoadmap,
  updateUserRoadmap,
  deleteUserRoadmap
} = require('../controllers/userRoadmapController');

// Get user roadmaps
router.get('/', authMiddleware, getUserRoadmaps);

// Get user statistics
router.get('/statistics', authMiddleware, getUserStatistics);

// Create user roadmap
router.post('/', authMiddleware, createUserRoadmap);

// Update user roadmap
router.put('/:id', authMiddleware, updateUserRoadmap);

// Delete user roadmap
router.delete('/:id', authMiddleware, deleteUserRoadmap);

module.exports = router;
