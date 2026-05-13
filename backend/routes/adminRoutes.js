const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserBan,
  deleteUser,
  getAdminLogs,
  moderateContent,
  getFlaggedContent,
  getSystemAnalytics
} = require('../controllers/adminController');

// Dashboard and Statistics
router.get('/dashboard/stats', authMiddleware, getDashboardStats);

// User Management
router.get('/users', authMiddleware, getAllUsers);
router.patch('/users/:userId/role', authMiddleware, updateUserRole);
router.post('/users/:userId/ban', authMiddleware, toggleUserBan);
router.delete('/users/:userId', authMiddleware, deleteUser);

// Content Moderation
router.post('/moderate', authMiddleware, moderateContent);
router.get('/moderation/flagged', authMiddleware, getFlaggedContent);

// Admin Logs
router.get('/logs', authMiddleware, getAdminLogs);

// Analytics
router.get('/analytics', authMiddleware, getSystemAnalytics);

module.exports = router;
