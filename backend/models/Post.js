const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 500
  },
  type: {
    type: String,
    enum: ['text', 'achievement', 'roadmap-completion', 'question', 'general'],
    default: 'text'
  },
  // Achievement posts are automatically generated
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  },
  // Roadmap completion posts reference the completed roadmap
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRoadmap'
  },
  // Post visibility
  visibility: {
    type: String,
    enum: ['public', 'followers-only', 'private'],
    default: 'public'
  },
  // Engagement metrics
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0
  },
  // Content moderation
  isReported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Tags and mentions
  tags: [String],
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
  },
  // Rich media support
  media: [{
    type: String, // URL to image/video
    mediaType: {
      type: String,
      enum: ['image', 'video', 'gif']
    },
    caption: String
  }]
});

// Indexes for performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 }); // For timeline feeds

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

module.exports = mongoose.model('Post', postSchema);