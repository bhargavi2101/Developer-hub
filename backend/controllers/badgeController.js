const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const UserRoadmap = require('../models/UserRoadmap');

// Get all available badges
const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ category: 1, rarity: 1 });
    res.status(200).json(badges);
  } catch (error) {
    console.log('Get all badges error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's earned badges
const getUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;

    const achievements = await Achievement.find({ userId, isUnlocked: true })
      .populate('badgeId')
      .sort({ unlockedAt: -1 });

    res.status(200).json(achievements);
  } catch (error) {
    console.log('Get user badges error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's badge progress
const getUserBadgeProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's statistics
    const user = await User.findById(userId);
    const userRoadmaps = await UserRoadmap.find({ userId });
    const achievements = await Achievement.find({ userId });

    // Calculate user stats
    const totalLessons = userRoadmaps.reduce((sum, roadmap) => sum + (roadmap.completedLessons || 0), 0);
    const completedRoadmaps = userRoadmaps.filter(r => r.progress === 100).length;
    const streakDays = user.learningStreak || 0;
    const totalPoints = user.totalPoints || 0;

    // Get all badges and calculate progress
    const allBadges = await Badge.find();
    const badgeProgress = [];

    for (const badge of allBadges) {
      const achievement = achievements.find(a => a.badgeId.toString() === badge._id.toString());
      let progress = 0;
      let currentCount = 0;
      let targetCount = badge.criteria.value;

      switch (badge.criteria.type) {
        case 'first_lesson':
          currentCount = totalLessons >= 1 ? 1 : 0;
          progress = currentCount >= targetCount ? 100 : 0;
          break;
        case 'lessons_completed':
          currentCount = totalLessons;
          progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
          break;
        case 'roadmaps_completed':
          currentCount = completedRoadmaps;
          progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
          break;
        case 'streak_days':
          currentCount = streakDays;
          progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
          break;
        case 'total_points':
          currentCount = totalPoints;
          progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
          break;
        default:
          progress = achievement?.progress || 0;
          currentCount = achievement?.currentCount || 0;
          targetCount = achievement?.targetCount || targetCount;
      }

      badgeProgress.push({
        badgeId: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        rarity: badge.rarity,
        points: badge.points,
        progress,
        currentCount,
        targetCount,
        isUnlocked: achievement?.isUnlocked || false,
        unlockedAt: achievement?.unlockedAt || null
      });
    }

    res.status(200).json(badgeProgress);
  } catch (error) {
    console.log('Get user badge progress error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Check for new achievements (called after user actions)
const checkAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const userRoadmaps = await UserRoadmap.find({ userId });
    const totalLessons = userRoadmaps.reduce((sum, roadmap) => sum + (roadmap.completedLessons || 0), 0);
    const completedRoadmaps = userRoadmaps.filter(r => r.progress === 100).length;
    const streakDays = user.learningStreak || 0;
    const totalPoints = user.totalPoints || 0;

    // Get all badges
    const allBadges = await Badge.find();
    const newAchievements = [];

    for (const badge of allBadges) {
      // Check if user already has this achievement
      const existingAchievement = await Achievement.findOne({
        userId,
        badgeId: badge._id
      });

      let currentCount = 0;
      let targetCount = badge.criteria.value;
      let isUnlocked = false;

      // Calculate current count based on badge criteria
      switch (badge.criteria.type) {
        case 'first_lesson':
          currentCount = totalLessons >= 1 ? 1 : 0;
          isUnlocked = currentCount >= targetCount;
          break;
        case 'lessons_completed':
          currentCount = totalLessons;
          isUnlocked = currentCount >= targetCount;
          break;
        case 'roadmaps_completed':
          currentCount = completedRoadmaps;
          isUnlocked = currentCount >= targetCount;
          break;
        case 'streak_days':
          currentCount = streakDays;
          isUnlocked = currentCount >= targetCount;
          break;
        case 'total_points':
          currentCount = totalPoints;
          isUnlocked = currentCount >= targetCount;
          break;
        default:
          // For special badges, skip automatic checking
          continue;
      }

      if (!existingAchievement && isUnlocked) {
        // Create new achievement
        const achievement = new Achievement({
          userId,
          badgeId: badge._id,
          isUnlocked: true,
          currentCount,
          targetCount,
          progress: 100
        });
        await achievement.save();

        // Award points to user
        user.totalPoints = (user.totalPoints || 0) + badge.points;
        await user.save();

        newAchievements.push({
          badge: badge,
          achievement: achievement
        });

        console.log(`🏆 Badge unlocked: ${badge.name} for user ${user.username}`);
      } else if (existingAchievement && !existingAchievement.isUnlocked && isUnlocked) {
        // Update existing achievement
        existingAchievement.isUnlocked = true;
        existingAchievement.currentCount = currentCount;
        existingAchievement.progress = 100;
        existingAchievement.unlockedAt = new Date();
        await existingAchievement.save();

        // Award points to user
        user.totalPoints = (user.totalPoints || 0) + badge.points;
        await user.save();

        newAchievements.push({
          badge: badge,
          achievement: existingAchievement
        });

        console.log(`🏆 Badge unlocked: ${badge.name} for user ${user.username}`);
      } else if (existingAchievement && !existingAchievement.isUnlocked) {
        // Update progress for incomplete achievements
        existingAchievement.currentCount = currentCount;
        existingAchievement.progress = Math.min(100, Math.round((currentCount / targetCount) * 100));
        await existingAchievement.save();
      }
    }

    return newAchievements;
  } catch (error) {
    console.log('Check achievements error:', error);
    return [];
  }
};

// Manual trigger for checking achievements
const triggerAchievementCheck = async (req, res) => {
  try {
    const userId = req.user.id;
    const newAchievements = await checkAchievements(userId);

    res.status(200).json({
      msg: `Checked ${newAchievements.length} new achievements`,
      newAchievements
    });
  } catch (error) {
    console.log('Trigger achievement check error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getAllBadges,
  getUserBadges,
  getUserBadgeProgress,
  checkAchievements,
  triggerAchievementCheck
};