const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log('Get user profile error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      username,
      email,
      firstName,
      lastName,
      bio,
      avatar,
      location,
      website,
      github,
      linkedin,
      skills,
      interests,
      learningGoals
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if username or email is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already taken' });
      }
      user.email = email;
    }

    // Update other fields with validation
    if (firstName !== undefined) user.firstName = firstName?.substring(0, 50) || '';
    if (lastName !== undefined) user.lastName = lastName?.substring(0, 50) || '';
    if (bio !== undefined) user.bio = bio?.substring(0, 500) || '';
    if (avatar !== undefined) user.avatar = avatar?.substring(0, 255) || '';
    if (location !== undefined) user.location = location?.substring(0, 100) || '';
    if (website !== undefined) user.website = website?.substring(0, 255) || '';
    if (github !== undefined) user.github = github?.substring(0, 100) || '';
    if (linkedin !== undefined) user.linkedin = linkedin?.substring(0, 100) || '';
    if (skills !== undefined && Array.isArray(skills)) user.skills = skills.slice(0, 20);
    if (interests !== undefined && Array.isArray(interests)) user.interests = interests.slice(0, 20);
    if (learningGoals !== undefined && Array.isArray(learningGoals)) user.learningGoals = learningGoals.slice(0, 10);

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json({
      msg: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ msg: 'New password must be at least 8 characters long' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Check if new password is same as current
    const isSamePassword = await user.matchPassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ msg: 'New password must be different from current password' });
    }

    // Hash and update password
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user preferences
const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, notifications, learningStyle, difficultyPreference } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update preferences
    if (theme !== undefined) user.preferences.theme = theme;
    if (notifications !== undefined) {
      if (notifications.email !== undefined) user.preferences.notifications.email = notifications.email;
      if (notifications.push !== undefined) user.preferences.notifications.push = notifications.push;
      if (notifications.learningReminders !== undefined) user.preferences.notifications.learningReminders = notifications.learningReminders;
    }
    if (learningStyle !== undefined) user.preferences.learningStyle = learningStyle;
    if (difficultyPreference !== undefined) user.preferences.difficultyPreference = difficultyPreference;

    await user.save();

    // Return updated preferences
    res.status(200).json({
      msg: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.log('Update user preferences error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get public user profile
const getPublicUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select('-password -email -followers -following');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's roadmaps for public view
    const UserRoadmap = require('../models/UserRoadmap');
    const roadmaps = await UserRoadmap.find({ userId: user._id })
      .select('title technologyId progress color')
      .limit(5);

    res.status(200).json({
      user: user,
      roadmaps: roadmaps
    });
  } catch (error) {
    console.log('Get public user profile error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .select('username firstName lastName avatar skills')
      .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    console.log('Search users error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateUserPreferences,
  getPublicUserProfile,
  searchUsers
};
