const UserRoadmap = require('../models/UserRoadmap');
const { checkAchievements } = require('./badgeController');

// Get user roadmaps
const getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const roadmaps = await UserRoadmap.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(roadmaps);
  } catch (error) {
    console.log('Get user roadmaps error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user statistics
const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const roadmaps = await UserRoadmap.find({ userId });
    const User = require('../models/User');
    const Achievement = require('../models/Achievement');

    // Get user data
    const user = await User.findById(userId);

    // Calculate statistics
    const activePaths = roadmaps.length;
    const totalProgress = roadmaps.reduce((sum, roadmap) => sum + roadmap.progress, 0);
    const avgProgress = activePaths > 0 ? Math.round(totalProgress / activePaths) : 0;

    // Calculate completed lessons from actual data
    const completedLessons = roadmaps.reduce((sum, roadmap) => sum + (roadmap.completedLessons || 0), 0);

    // Calculate hub points (formula: 10 points per completed lesson + 100 points per active roadmap)
    const hubPoints = completedLessons * 10 + activePaths * 100;

    // Gamification elements
    const learningStreak = user.learningStreak || 0;
    const lastLearningDate = user.lastLearningDate;
    const totalPoints = user.totalPoints || 0;

    // Get achievement count
    const earnedAchievements = await Achievement.countDocuments({ userId, isUnlocked: true });

    // Calculate leaderboard position (simplified - would need more complex query for full implementation)
    const allUsers = await User.countDocuments();
    const usersWithMorePoints = await User.countDocuments({ totalPoints: { $gt: totalPoints } });
    const leaderboardPosition = usersWithMorePoints + 1;

    res.status(200).json({
      activePaths,
      completedLessons,
      hubPoints,
      avgProgress,
      learningStreak,
      lastLearningDate,
      totalPoints,
      earnedAchievements,
      leaderboardPosition,
      totalUsers: allUsers
    });
  } catch (error) {
    console.log('Get user statistics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create user roadmap
const createUserRoadmap = async (req, res) => {
  try {
    const { title, technologyId, progress, completedLessons, totalLessons, color } = req.body;
    const userId = req.user.id;

    const roadmap = new UserRoadmap({
      userId,
      title,
      technologyId,
      progress: progress || 0,
      completedLessons: completedLessons || 0,
      totalLessons: totalLessons || 0,
      color: color || '#3b82f6'
    });

    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (error) {
    console.log('Create user roadmap error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user roadmap
const updateUserRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { progress, title, color, completedLessons, totalLessons, lastSubTechnologyId } = req.body;

    const roadmap = await UserRoadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }

    // Update fields
    if (progress !== undefined) {
      roadmap.progress = Math.min(100, Math.max(0, progress)); // Ensure progress is between 0-100
    }
    if (title !== undefined) {
      roadmap.title = title;
    }
    if (color !== undefined) {
      roadmap.color = color;
    }
    if (completedLessons !== undefined) {
      roadmap.completedLessons = completedLessons;
    }
    if (totalLessons !== undefined) {
      roadmap.totalLessons = totalLessons;
    }
    if (lastSubTechnologyId !== undefined) {
      roadmap.lastSubTechnologyId = lastSubTechnologyId;
    }

    await roadmap.save();

    // Update user's learning streak and check for achievements
    await updateLearningStreak(userId);
    await checkAchievements(userId);

    res.status(200).json(roadmap);
  } catch (error) {
    console.log('Update user roadmap error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to update learning streak
const updateLearningStreak = async (userId) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLearningDate = user.lastLearningDate ? new Date(user.lastLearningDate) : null;
    let currentStreak = user.learningStreak || 0;

    if (lastLearningDate) {
      lastLearningDate.setHours(0, 0, 0, 0);
      const dayDifference = Math.floor((today - lastLearningDate) / (1000 * 60 * 60 * 24));

      if (dayDifference === 1) {
        // Consecutive day - increment streak
        currentStreak++;
      } else if (dayDifference > 1) {
        // Streak broken - reset to 1
        currentStreak = 1;
      }
      // If dayDifference === 0, same day - keep current streak
    } else {
      // First learning activity
      currentStreak = 1;
    }

    user.learningStreak = currentStreak;
    user.lastLearningDate = new Date();
    await user.save();

    console.log(`Updated streak for user ${user.username}: ${currentStreak} days`);
  } catch (error) {
    console.log('Update learning streak error:', error);
  }
};

// Delete user roadmap
const deleteUserRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const roadmap = await UserRoadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }

    await UserRoadmap.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Roadmap deleted' });
  } catch (error) {
    console.log('Delete user roadmap error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getUserRoadmaps,
  getUserStatistics,
  createUserRoadmap,
  updateUserRoadmap,
  deleteUserRoadmap
};
