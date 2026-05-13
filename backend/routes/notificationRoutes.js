const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification,
  createAchievementNotification,
  createFollowNotification,
  createLikeNotification,
  createCommentNotification,
  createForumReplyNotification,
  cleanupOldNotifications
} = require('../controllers/notificationController');

// Get user notifications
router.get('/', authMiddleware, getUserNotifications);

// Get unread notification count
router.get('/unread-count', authMiddleware, getUnreadCount);

// Mark notifications as read
router.post('/read', authMiddleware, markAsRead);

// Mark all notifications as read
router.post('/read-all', authMiddleware, markAllAsRead);

// Delete notification
router.delete('/:notificationId', authMiddleware, deleteNotification);

// Create notification (internal API for other services)
router.post('/', authMiddleware, createNotification);

// Create specific notification types (for use by other services)
router.post('/achievement', authMiddleware, createAchievementNotification);
router.post('/follow', authMiddleware, createFollowNotification);
router.post('/like', authMiddleware, createLikeNotification);
router.post('/comment', authMiddleware, createCommentNotification);
router.post('/forum-reply', authMiddleware, createForumReplyNotification);

// Cleanup old notifications (admin route)
router.delete('/cleanup', authMiddleware, cleanupOldNotifications);

module.exports = router;