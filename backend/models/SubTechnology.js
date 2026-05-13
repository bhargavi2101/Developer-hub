const mongoose = require('mongoose');

const subTechnologySchema = new mongoose.Schema({
  technologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  order: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: ''
  },
  objectives: [{
    type: String
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTechnology'
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'documentation', 'tutorial', 'other'],
      default: 'article'
    }
  }],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
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
subTechnologySchema.index({ technologyId: 1, order: 1 });
subTechnologySchema.index({ technologyId: 1, slug: 1 });
subTechnologySchema.index({ isActive: 1 });

// Pre-save middleware to update slug and updatedAt
subTechnologySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SubTechnology', subTechnologySchema);
