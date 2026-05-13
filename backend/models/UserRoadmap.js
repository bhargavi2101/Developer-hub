const mongoose = require('mongoose');

const userRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  technologyId: {
    type: String,
    required: true
  },
  lastSubTechnologyId: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  // Time tracking fields
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  sessionCount: {
    type: Number,
    default: 0
  },
  averageSessionTime: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserRoadmap', userRoadmapSchema);
