const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // For progressive achievements
  currentCount: {
    type: Number,
    default: 0
  },
  targetCount: {
    type: Number,
    required: true
  },
  isUnlocked: {
    type: Boolean,
    default: false
  }
});

// Index for efficient queries
achievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
achievementSchema.index({ userId: 1, isUnlocked: 1 });
achievementSchema.index({ userId: 1, unlockedAt: -1 });

// Virtual for progress percentage
achievementSchema.virtual('progressPercentage').get(function() {
  if (this.targetCount === 0) return 100;
  return Math.min(100, Math.round((this.currentCount / this.targetCount) * 100));
});

module.exports = mongoose.model('Achievement', achievementSchema);