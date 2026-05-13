const notificationService = require('../services/notificationService');
const authMiddleware = require('../middlewares/authMiddleware');

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit, offset, unreadOnly, type } = req.query;

    const options = {
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
      unreadOnly: unreadOnly === 'true',
      type: type || null
    };

    const result = await notificationService.getUserNotifications(userId, options);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications'
    });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Notification IDs required'
      });
    }

    const result = await notificationService.markAsRead(userId, notificationIds);

    res.json(result);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notifications as read'
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await notificationService.markAllAsRead(userId);

    res.json(result);
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read'
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID required'
      });
    }

    const result = await notificationService.deleteNotification(userId, notificationId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await notificationService.getUnreadCount(userId);

    res.json(result);
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count'
    });
  }
};

// Create notification (internal use)
const createNotification = async (req, res) => {
  try {
    const notificationData = req.body;

    const notification = await notificationService.createNotification(notificationData);

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
};

// Create specific notification types (for use by other controllers)
const createAchievementNotification = async (req, res) => {
  try {
    const { userId, badgeName, badgeIcon } = req.body;

    const notification = await notificationService.createAchievementNotification(
      userId,
      badgeName,
      badgeIcon
    );

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create achievement notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create achievement notification'
    });
  }
};

const createFollowNotification = async (req, res) => {
  try {
    const { userId, followerName, followerId } = req.body;

    const notification = await notificationService.createFollowNotification(
      userId,
      followerName,
      followerId
    );

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create follow notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create follow notification'
    });
  }
};

const createLikeNotification = async (req, res) => {
  try {
    const { userId, likerName, likerId, postId } = req.body;

    const notification = await notificationService.createLikeNotification(
      userId,
      likerName,
      likerId,
      postId
    );

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create like notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create like notification'
    });
  }
};

const createCommentNotification = async (req, res) => {
  try {
    const { userId, commenterName, commenterId, postId } = req.body;

    const notification = await notificationService.createCommentNotification(
      userId,
      commenterName,
      commenterId,
      postId
    );

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create comment notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create comment notification'
    });
  }
};

const createForumReplyNotification = async (req, res) => {
  try {
    const { userId, replierName, replierId, forumId } = req.body;

    const notification = await notificationService.createForumReplyNotification(
      userId,
      replierName,
      replierId,
      forumId
    );

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create forum reply notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create forum reply notification'
    });
  }
};

// Clean up old notifications (admin only)
const cleanupOldNotifications = async (req, res) => {
  try {
    const { daysOld = 30 } = req.query;

    const result = await notificationService.cleanupOldNotifications(parseInt(daysOld));

    res.json(result);
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup old notifications'
    });
  }
};

module.exports = {
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
};