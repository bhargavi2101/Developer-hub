const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'LESSON_START',
      'LESSON_COMPLETE',
      'QUIZ_ATTEMPT',
      'QUIZ_COMPLETE',
      'NOTE_CREATE',
      'NOTE_UPDATE',
      'NOTE_DELETE',
      'POST_CREATE',
      'POST_LIKE',
      'COMMENT_CREATE',
      'FORUM_CREATE',
      'FORUM_REPLY',
      'FOLLOW_USER',
      'EARN_BADGE',
      'STREAK_MILESTONE'
    ],
    index: true
  },
  resourceType: {
    type: String,
    enum: ['lesson', 'quiz', 'note', 'post', 'forum', 'badge', 'user', 'other']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  sessionId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes for performance
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ activityType: 1, createdAt: -1 });
userActivitySchema.index({ createdAt: -1 });
userActivitySchema.index({ resourceType: 1, resourceId: 1 });

// Static method to log activity
userActivitySchema.statics.logActivity = async function(userId, activityType, data = {}) {
  try {
    const activity = new this({
      userId,
      activityType,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      description: data.description,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      sessionId: data.sessionId
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

module.exports = mongoose.model('UserActivity', userActivitySchema);
