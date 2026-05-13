const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE_ROADMAP',
      'UPDATE_ROADMAP',
      'DELETE_ROADMAP',
      'CREATE_TECHNOLOGY',
      'UPDATE_TECHNOLOGY',
      'DELETE_TECHNOLOGY',
      'BAN_USER',
      'UNBAN_USER',
      'DELETE_USER',
      'UPDATE_USER_ROLE',
      'MODERATE_CONTENT',
      'SYSTEM_CONFIG',
      'BULK_ACTION'
    ]
  },
  targetType: {
    type: String,
    enum: ['roadmap', 'technology', 'subTechnology', 'user', 'content', 'system']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  targetName: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'PARTIAL'],
    default: 'SUCCESS'
  },
  errorMessage: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes for performance
adminLogSchema.index({ adminId: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });
adminLogSchema.index({ targetType: 1, createdAt: -1 });
adminLogSchema.index({ createdAt: -1 });

// Virtual for time ago
adminLogSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now.getTime() - this.createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return this.createdAt.toLocaleDateString();
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
