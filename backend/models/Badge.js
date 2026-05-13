const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆' // Default trophy icon
  },
  category: {
    type: String,
    enum: ['learning', 'engagement', 'achievement', 'special'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 100
  },
  criteria: {
    type: {
      type: String,
      enum: ['lessons_completed', 'roadmaps_completed', 'streak_days', 'total_points', 'first_lesson', 'all_completed'],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Rarity color mapping for frontend display
badgeSchema.virtual('color').get(function() {
  const colors = {
    common: '#9ca3af',     // Gray
    rare: '#3b82f6',       // Blue
    epic: '#8b5cf6',        // Purple
    legendary: '#f59e0b'     // Gold
  };
  return colors[this.rarity] || colors.common;
});

// Rarity multiplier for points
badgeSchema.virtual('multiplier').get(function() {
  const multipliers = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 5
  };
  return multipliers[this.rarity] || 1;
});

module.exports = mongoose.model('Badge', badgeSchema);