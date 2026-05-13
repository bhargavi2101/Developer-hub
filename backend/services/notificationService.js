const Notification = require('../models/Notification');
const emailService = require('./emailService');
const User = require('../models/User');

class NotificationService {
  constructor() {
    this.emailService = emailService;
    this.emailService.initialize();
  }

  // Create and send notification
  async createNotification(data) {
    try {
      // Validate required fields
      if (!data.userId || !data.type || !data.title || !data.message) {
        throw new Error('Missing required notification fields');
      }

      // Get user preferences
      const user = await User.findById(data.userId).select('preferences email username firstName');
      if (!user) {
        throw new Error('User not found');
      }

      // Determine which delivery methods to use based on user preferences
      const deliveryMethods = this.getDeliveryMethods(data.type, user.preferences);

      // Create notification
      const notification = await Notification.createNotification({
        ...data,
        deliveryMethods
      });

      // Send notifications via enabled methods
      await this.deliverNotification(notification, user, deliveryMethods);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get delivery methods based on notification type and user preferences
  getDeliveryMethods(notificationType, preferences) {
    const methods = {
      inApp: true,
      email: false,
      push: false
    };

    // Enable email based on preferences
    if (preferences && preferences.notifications) {
      switch (notificationType) {
        case 'achievement':
          methods.email = preferences.notifications.email;
          break;
        case 'follow':
          methods.email = preferences.notifications.email;
          break;
        case 'like':
          methods.email = preferences.notifications.email;
          break;
        case 'comment':
          methods.email = preferences.notifications.email;
          break;
        case 'forum_reply':
          methods.email = preferences.notifications.email;
          break;
        case 'system':
          methods.email = true; // Always send system notifications via email
          break;
        default:
          methods.email = preferences.notifications.email;
      }
    }

    return methods;
  }

  // Deliver notification via specified methods
  async deliverNotification(notification, user, deliveryMethods) {
    const deliveryPromises = [];

    // In-app delivery (always enabled)
    deliveryPromises.push(this.deliverInApp(notification, user));

    // Email delivery
    if (deliveryMethods.email) {
      deliveryPromises.push(this.deliverEmail(notification, user));
    }

    // Push notification delivery (placeholder for future implementation)
    if (deliveryMethods.push) {
      deliveryPromises.push(this.deliverPush(notification, user));
    }

    // Wait for all delivery attempts
    await Promise.allSettled(deliveryPromises);
  }

  // Deliver in-app notification
  async deliverInApp(notification, user) {
    try {
      // Update delivery status
      notification.deliveryStatus = 'delivered';
      notification.deliveryMethods.inApp = true;
      await notification.save();

      return { success: true, method: 'inApp' };
    } catch (error) {
      console.error('In-app delivery error:', error);
      return { success: false, method: 'inApp', error: error.message };
    }
  }

  // Deliver email notification
  async deliverEmail(notification, user) {
    try {
      const result = await this.emailService.sendNotificationEmail(
        user.email,
        user.firstName,
        notification.title,
        notification.message,
        this.getActionUrl(notification)
      );

      if (result.success) {
        notification.deliveryMethods.email = true;
        await notification.save();
      }

      return { success: result.success, method: 'email', messageId: result.messageId };
    } catch (error) {
      console.error('Email delivery error:', error);
      notification.deliveryStatus = 'failed';
      await notification.save();
      return { success: false, method: 'email', error: error.message };
    }
  }

  // Deliver push notification (placeholder)
  async deliverPush(notification, user) {
    // TODO: Implement push notification service
    console.log('Push notification delivery:', notification.title);
    return { success: false, method: 'push', error: 'Push notifications not yet implemented' };
  }

  // Get action URL for notification
  getActionUrl(notification) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    switch (notification.type) {
      case 'achievement':
        return `${baseUrl}/badges`;
      case 'follow':
        return `${baseUrl}/profile/${notification.data.followerUsername}`;
      case 'like':
        return `${baseUrl}/social-feed`;
      case 'comment':
        return `${baseUrl}/social-feed`;
      case 'forum_reply':
        return `${baseUrl}/forum-topic/${notification.relatedForumId}`;
      case 'badge':
        return `${baseUrl}/badges`;
      case 'learning_milestone':
        return `${baseUrl}/dashboard`;
      case 'quiz_result':
        return `${baseUrl}/quiz/${notification.data.quizId}`;
      case 'system':
        return `${baseUrl}/dashboard`;
      default:
        return `${baseUrl}/dashboard`;
    }
  }

  // Get user notifications
  async getUserNotifications(userId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      unreadOnly = false,
      type = null
    } = options;

    const query = { userId };

    if (unreadOnly) {
      query.isRead = false;
    }

    if (type) {
      query.type = type;
    }

    // Delete expired notifications
    await Notification.cleanupExpired();

    const notifications = await Notification.find(query)
      .populate('relatedUserId', 'username firstName lastName avatar')
      .populate('relatedPostId', 'content')
      .populate('relatedForumId', 'title')
      .populate('relatedBadgeId', 'name icon')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(userId);

    return {
      notifications,
      total,
      unreadCount,
      limit,
      offset
    };
  }

  // Mark notifications as read
  async markAsRead(userId, notificationIds) {
    try {
      await Notification.markAsRead(userId, notificationIds);
      return { success: true };
    } catch (error) {
      console.error('Mark as read error:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      await Notification.markAllAsRead(userId);
      return { success: true };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete notification
  async deleteNotification(userId, notificationId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await Notification.findByIdAndDelete(notificationId);
      return { success: true };
    } catch (error) {
      console.error('Delete notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create specific notification types
  async createAchievementNotification(userId, badgeName, badgeIcon) {
    return this.createNotification({
      userId,
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: `Congratulations! You earned the ${badgeName} badge.`,
      data: { badgeName, badgeIcon },
      relatedBadgeId: badgeName,
      priority: 'high'
    });
  }

  async createFollowNotification(userId, followerName, followerId) {
    return this.createNotification({
      userId,
      type: 'follow',
      title: 'New Follower',
      message: `${followerName} started following you.`,
      data: { followerName, followerId },
      relatedUserId: followerId,
      priority: 'normal'
    });
  }

  async createLikeNotification(userId, likerName, likerId, postId) {
    return this.createNotification({
      userId,
      type: 'like',
      title: 'Post Liked',
      message: `${likerName} liked your post.`,
      data: { likerName, likerId, postId },
      relatedUserId: likerId,
      relatedPostId: postId,
      priority: 'low'
    });
  }

  async createCommentNotification(userId, commenterName, commenterId, postId) {
    return this.createNotification({
      userId,
      type: 'comment',
      title: 'New Comment',
      message: `${commenterName} commented on your post.`,
      data: { commenterName, commenterId, postId },
      relatedUserId: commenterId,
      relatedPostId: postId,
      priority: 'normal'
    });
  }

  async createForumReplyNotification(userId, replierName, replierId, forumId) {
    return this.createNotification({
      userId,
      type: 'forum_reply',
      title: 'Forum Reply',
      message: `${replierName} replied to your forum post.`,
      data: { replierName, replierId, forumId },
      relatedUserId: replierId,
      relatedForumId: forumId,
      priority: 'normal'
    });
  }

  async createLearningMilestoneNotification(userId, milestoneTitle, technology) {
    return this.createNotification({
      userId,
      type: 'learning_milestone',
      title: '🎉 Learning Milestone!',
      message: `You've reached a milestone in ${technology}!`,
      data: { milestoneTitle, technology },
      priority: 'high'
    });
  }

  async createQuizResultNotification(userId, quizTitle, score, passed) {
    return this.createNotification({
      userId,
      type: 'quiz_result',
      title: passed ? '✅ Quiz Passed!' : '❌ Quiz Failed',
      message: `You scored ${score}% on ${quizTitle}.`,
      data: { quizTitle, score, passed },
      priority: 'normal'
    });
  }

  async createSystemNotification(userId, title, message, priority = 'normal') {
    return this.createNotification({
      userId,
      type: 'system',
      title,
      message,
      data: {},
      priority
    });
  }

  // Get unread notification count
  async getUnreadCount(userId) {
    try {
      const count = await Notification.getUnreadCount(userId);
      return { success: true, count };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clean up old notifications
  async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isRead: true
      });
      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return { success: true, deletedCount: result.deletedCount };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();