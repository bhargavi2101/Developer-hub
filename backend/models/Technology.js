const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'mobile', 'devops', 'data-science', 'ai/ml', 'security', 'other']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  tags: [{
    type: String
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  estimatedTime: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
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
technologySchema.index({ slug: 1 });
technologySchema.index({ category: 1, sortOrder: 1 });
technologySchema.index({ isActive: 1, isFeatured: 1 });
technologySchema.index({ tags: 1 });

// Pre-save middleware to update slug and updatedAt
technologySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  this.updatedAt = new Date();
  next();
});

// Virtual for subtechnology count
technologySchema.virtual('subTechnologiesCount').get(function() {
  return this.subTechnologies?.length || 0;
});

module.exports = mongoose.model('Technology', technologySchema);
