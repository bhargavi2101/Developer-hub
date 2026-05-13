const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  // Extended Profile Fields
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  learningGoals: {
    type: [String],
    default: []
  },
  // User Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      learningReminders: {
        type: Boolean,
        default: true
      }
    },
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'reading'
    },
    difficultyPreference: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  },
  // Social Connections
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Social settings
  social: {
    shareProgress: {
      type: Boolean,
      default: true
    },
    allowFollowers: {
      type: Boolean,
      default: true
    },
    showLearningActivity: {
      type: Boolean,
      default: true
    }
  },
  // Gamification Fields
  learningStreak: {
    type: Number,
    default: 0
  },
  lastLearningDate: {
    type: Date
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  // Admin Fields
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  bannedAt: {
    type: Date
  },
  banReason: {
    type: String
  },
  lastLoginAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.log('Password matching error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
