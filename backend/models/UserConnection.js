const mongoose = require('mongoose');

const userConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  connectedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  },
  // Additional metadata for social features
  mutualConnections: {
    type: Number,
    default: 0
  },
  sharedRoadmaps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRoadmap'
  }],
  // For recommendations
  commonInterests: {
    type: [String],
    default: []
  },
  commonSkills: {
    type: [String],
    default: []
  }
});

// Indexes for performance
userConnectionSchema.index({ userId: 1, status: 1 });
userConnectionSchema.index({ connectedUserId: 1, status: 1 });
userConnectionSchema.index({ userId: 1, connectedUserId: 1 }, { unique: true });
userConnectionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('UserConnection', userConnectionSchema);