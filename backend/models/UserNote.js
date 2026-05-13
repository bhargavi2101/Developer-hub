const mongoose = require('mongoose');

const userNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roadmapId: {
    type: String,
    required: true
  },
  subTechnologyId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  // Additional metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // For tracking when note was last accessed
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  // Word count for analytics
  wordCount: {
    type: Number,
    default: 0
  }
});

// Pre-save middleware to calculate word count
userNoteSchema.pre('save', function(next) {
  if (this.content) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
  this.updatedAt = new Date();
  next();
});

// Indexes for performance
userNoteSchema.index({ userId: 1, roadmapId: 1 });
userNoteSchema.index({ userId: 1, subTechnologyId: 1 });
userNoteSchema.index({ userId: 1, tags: 1 });
userNoteSchema.index({ userId: 1, createdAt: -1 });
userNoteSchema.index({ content: 'text' }); // For text search

module.exports = mongoose.model('UserNote', userNoteSchema);