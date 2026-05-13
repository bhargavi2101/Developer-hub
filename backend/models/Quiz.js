const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  subTechnologyId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'text', 'code'],
      required: true
    },
    options: [{
      type: String
    }],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    explanation: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 10
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  timeLimit: {
    type: Number, // in minutes
    default: 15
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  passingScore: {
    type: Number, // percentage required to pass
    default: 70
  },
  isActive: {
    type: Boolean,
    default: true
  },
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
quizSchema.index({ subTechnologyId: 1 });
quizSchema.index({ isActive: 1, difficulty: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);