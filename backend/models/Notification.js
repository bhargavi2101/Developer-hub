const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  type: {
    type: String,
    required: true,
    enum: [
      'achievement',
      'follow',
      'like',
      'comment',
      'forum_reply',
      'badge',
      'learning_milestone',
      'quiz_result',
      'social_update',
      'system'
    ]
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Priority levels
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Related entities
  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  relatedForumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum'
  },
  relatedBadgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  },

  // Read status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },

  // Delivery status
  deliveryStatus: {
    type: String,
    enum: ['pending', 'delivered', 'failed'],
    default: 'pending'
  },

  // Delivery methods
  deliveryMethods: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Expiration (optional)
  expiresAt: {
    type: Date
  }
});

// Compound indexes for better query performance
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, deliveryStatus: 1 });

// Pre-save middleware to set default expiration for system notifications
notificationSchema.pre('save', function(next) {
  if (this.type === 'system' && !this.expiresAt) {
    // System notifications expire after 30 days
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Static method to create notifications
notificationSchema.statics.createNotification = async function(data) {
  const Notification = this;
  const notification = new Notification({
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    data: data.data || {},
    priority: data.priority || 'normal',
    relatedUserId: data.relatedUserId,
    relatedPostId: data.relatedPostId,
    relatedForumId: data.relatedForumId,
    relatedBadgeId: data.relatedBadgeId,
    expiresAt: data.expiresAt
  });

  return notification.save();
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      userId: userId,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    {
      userId: userId,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    userId: userId,
    isRead: false
  });
};

// Static method to clean up expired notifications
notificationSchema.statics.cleanupExpired = async function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);