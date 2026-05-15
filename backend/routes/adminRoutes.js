const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
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
router.get('/dashboard/stats', authMiddleware, adminMiddleware, getDashboardStats);

// User Management
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.patch('/users/:userId/role', authMiddleware, adminMiddleware, updateUserRole);
router.post('/users/:userId/ban', authMiddleware, adminMiddleware, toggleUserBan);
router.delete('/users/:userId', authMiddleware, adminMiddleware, deleteUser);

// Content Moderation
router.post('/moderate', authMiddleware, adminMiddleware, moderateContent);
router.get('/moderation/flagged', authMiddleware, adminMiddleware, getFlaggedContent);

// Admin Logs
router.get('/logs', authMiddleware, adminMiddleware, getAdminLogs);

// Analytics
router.get('/analytics', authMiddleware, adminMiddleware, getSystemAnalytics);

module.exports = router;
