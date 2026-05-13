const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  subTechnologyId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  answers: [{
    questionIndex: Number,
    questionId: mongoose.Schema.Types.ObjectId,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  timeSpent: {
    type: Number, // total time in seconds
    required: true
  },
  attempts: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  // Performance metrics
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  skippedQuestions: {
    type: Number,
    default: 0
  },
  averageTimePerQuestion: {
    type: Number,
    default: 0
  }
});

// Pre-save middleware to calculate performance metrics
quizResultSchema.pre('save', async function(next) {
  try {
    // Calculate percentage
    this.percentage = Math.round((this.score / this.maxScore) * 100);

    // Determine if passed
    const quiz = require('../models/Quiz');
    const quizDoc = await quiz.findById(this.quizId);

    if (quizDoc) {
      this.passed = this.percentage >= quizDoc.passingScore;

      // Calculate performance metrics
      this.correctAnswers = this.answers.filter(a => a.isCorrect).length;
      this.incorrectAnswers = this.answers.filter(a => !a.isCorrect && a.userAnswer !== null).length;
      this.skippedQuestions = this.answers.filter(a => a.userAnswer === null).length;

      // Calculate average time per question (excluding skipped)
      const answeredQuestions = this.answers.filter(a => a.userAnswer !== null);
      if (answeredQuestions.length > 0) {
        this.averageTimePerQuestion = Math.round(this.timeSpent / answeredQuestions.length);
      }
    }

    next();
  } catch (err) {
    console.log('Error calculating quiz metrics:', err);
    next();
  }
});

// Indexes for performance
quizResultSchema.index({ userId: 1, quizId: 1 });
quizResultSchema.index({ userId: 1, completedAt: -1 });
quizResultSchema.index({ subTechnologyId: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);