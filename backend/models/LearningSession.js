const mongoose = require('mongoose');

const learningSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  technologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true,
    index: true
  },
  subTechnologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTechnology',
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  completionStatus: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  progressMade: {
    type: Number, // percentage
    default: 0
  },
  activities: [{
    type: {
      type: String,
      enum: ['start', 'pause', 'resume', 'complete', 'quiz_attempt', 'note_taken']
    },
    timestamp: Date,
    metadata: mongoose.Schema.Types.Mixed
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

// Indexes for performance
learningSessionSchema.index({ userId: 1, startTime: -1 });
learningSessionSchema.index({ technologyId: 1, startTime: -1 });
learningSessionSchema.index({ startTime: -1 });

// Pre-save middleware to calculate duration
learningSessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000);
  }
  next();
});

module.exports = mongoose.model('LearningSession', learningSessionSchema);
