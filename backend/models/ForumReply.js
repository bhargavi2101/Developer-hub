const mongoose = require('mongoose');

const forumReplySchema = new mongoose.Schema({
  forumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 2000
  },
  // Thread support for nested replies
  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumReply'
  },
  // Reply hierarchy and organization
  depth: {
    type: Number,
    default: 0
  },
  // Engagement
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isAcceptedAnswer: {
    type: Boolean,
    default: false
  },
  // Content moderation
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Code sharing support
  codeBlocks: [{
    language: String,
    code: String
  }],
  // Mentions
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
forumReplySchema.index({ forumId: 1, createdAt: -1 });
forumReplySchema.index({ userId: 1, createdAt: -1 });
forumReplySchema.index({ parentReplyId: 1 });
forumReplySchema.index({ createdAt: -1 });

// Virtual for like count
forumReplySchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

module.exports = mongoose.model('ForumReply', forumReplySchema);