const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  technologyId: {
    type: String,
    required: true
  },
  subTechnologyId: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  // Forum categorization
  category: {
    type: String,
    enum: ['question', 'discussion', 'resource-sharing', 'help', 'general'],
    default: 'discussion'
  },
  tags: [String],
  // Forum moderation
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Statistics
  viewCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  },
  // Sorting
  lastReplyAt: {
    type: Date
  },
  // Created by user (can be null for system threads)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
forumSchema.index({ technologyId: 1, isPinned: -1, createdAt: -1 });
forumSchema.index({ technologyId: 1, category: 1, createdAt: -1 });
forumSchema.index({ tags: 1 });
forumSchema.index({ createdBy: 1, createdAt: -1 });
forumSchema.index({ updatedAt: -1 }); // For recent activity

module.exports = mongoose.model('Forum', forumSchema);