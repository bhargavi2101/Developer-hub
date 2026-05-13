const UserRoadmap = require('../models/UserRoadmap');
const User = require('../models/User');

// Start learning session
const startSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roadmapId } = req.body;

    if (!roadmapId) {
      return res.status(400).json({ msg: 'roadmapId is required' });
    }

    const roadmap = await UserRoadmap.findOne({ _id: roadmapId, userId });
    if (!roadmap) {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }

    // Update last accessed time
    roadmap.lastAccessed = new Date();
    roadmap.sessionCount += 1;

    await roadmap.save();

    // Update user's last learning date
    const user = await User.findById(userId);
    user.lastLearningDate = new Date();
    await user.save();

    res.status(200).json({
      message: 'Session started',
      sessionId: `${roadmapId}-${Date.now()}`,
      startTime: new Date()
    });
  } catch (error) {
    console.log('Start session error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// End learning session and record time
const endSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roadmapId, sessionId, timeSpent } = req.body;

    if (!roadmapId || !timeSpent) {
      return res.status(400).json({ msg: 'roadmapId and timeSpent are required' });
    }

    const roadmap = await UserRoadmap.findOne({ _id: roadmapId, userId });
    if (!roadmap) {
      return res.status(404).json({ msg: 'Roadmap not found' });
    }

    // Update total time spent
    roadmap.totalTimeSpent += timeSpent;
    roadmap.lastAccessed = new Date();

    // Calculate average session time
    const totalSessions = roadmap.sessionCount;
    const averageTime = Math.round(roadmap.totalTimeSpent / totalSessions);
    roadmap.averageSessionTime = averageTime;

    await roadmap.save();

    // Check for time-based achievements
    const { checkAchievements } = require('./badgeController');
    await checkAchievements(userId);

    res.status(200).json({
      message: 'Session ended',
      totalMinutes: roadmap.totalTimeSpent,
      sessionMinutes: timeSpent,
      averageMinutes: averageTime
    });
  } catch (error) {
    console.log('End session error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get learning time analytics
const getTimeAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query; // 'day', 'week', 'month', 'all'

    let startDate = new Date();
    const now = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
      default:
        startDate = new Date(0);
    }

    const roadmaps = await UserRoadmap.find({
      userId,
      lastAccessed: { $gte: startDate }
    });

    // Calculate analytics
    const totalMinutes = roadmaps.reduce((sum, r) => sum + (r.totalTimeSpent || 0), 0);
    const totalSessions = roadmaps.reduce((sum, r) => sum + (r.sessionCount || 0), 0);
    const averageSessionTime = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    // Time by roadmap
    const timeByRoadmap = roadmaps.map(r => ({
      roadmapId: r._id,
      title: r.title,
      totalTime: r.totalTimeSpent || 0,
      sessionCount: r.sessionCount || 0,
      averageTime: r.averageSessionTime || 0,
      lastAccessed: r.lastAccessed
    })).sort((a, b) => b.totalTime - a.totalTime);

    // Daily breakdown
    const dailyBreakdown = await getDailyBreakdown(userId, startDate);

    // Convert to hours and minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins = totalMinutes % 60;

    res.status(200).json({
      period: period || 'all',
      totalMinutes,
      totalHours,
      totalMins,
      totalSessions,
      averageSessionTime,
      timeByRoadmap,
      dailyBreakdown,
      roadmapsTracked: roadmaps.length
    });
  } catch (error) {
    console.log('Get time analytics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to get daily breakdown
const getDailyBreakdown = async (userId, startDate) => {
  const roadmaps = await UserRoadmap.find({ userId });

  const dailyData = {};
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  // Initialize daily data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(start);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyData[dateStr] = {
      date: dateStr,
      minutes: 0,
      sessions: 0
    };
  }

  // Populate daily data
  roadmaps.forEach(roadmap => {
    if (roadmap.lastAccessed >= start) {
      const accessDate = new Date(roadmap.lastAccessed);
      const dateStr = accessDate.toISOString().split('T')[0];

      if (dailyData[dateStr]) {
        dailyData[dateStr].minutes += (roadmap.totalTimeSpent || 0);
        dailyData[dateStr].sessions += (roadmap.sessionCount || 0);
      }
    }
  });

  return Object.values(dailyData).filter(d => d.minutes > 0 || d.sessions > 0);
};

// Get learning streaks based on time
const getTimeBasedStreaks = async (req, res) => {
  try {
    const userId = req.user.id;

    const roadmaps = await UserRoadmap.find({ userId });
    const user = await User.findById(userId);

    // Calculate different types of streaks
    const consecutiveDays = await calculateConsecutiveDays(userId);
    const weeklyGoal = await calculateWeeklyGoal(userId);
    const monthlyGoal = await calculateMonthlyGoal(userId);

    // Time tracking statistics
    const totalLearningTime = roadmaps.reduce((sum, r) => sum + (r.totalTimeSpent || 0), 0);
    const totalHours = Math.floor(totalLearningTime / 60);
    const avgDailyMinutes = consecutiveDays > 0 ? Math.round(totalLearningTime / consecutiveDays) : 0;

    res.status(200).json({
      consecutiveDays,
      totalLearningTime,
      totalHours,
      avgDailyMinutes,
      weeklyGoal,
      monthlyGoal,
      learningStreak: user.learningStreak || 0
    });
  } catch (error) {
    console.log('Get time-based streaks error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to calculate consecutive learning days
const calculateConsecutiveDays = async (userId) => {
  const UserRoadmap = require('../models/UserRoadmap');
  const roadmaps = await UserRoadmap.find({ userId });

  const accessDates = new Set();
  roadmaps.forEach(r => {
    if (r.lastAccessed) {
      const dateStr = new Date(r.lastAccessed).toISOString().split('T')[0];
      accessDates.add(dateStr);
    }
  });

  const sortedDates = Array.from(accessDates).sort().reverse();
  let consecutiveDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const dateStr of sortedDates) {
    const checkDate = new Date(dateStr);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - consecutiveDays);
    expectedDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === expectedDate.getTime()) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return consecutiveDays;
};

// Helper function to calculate weekly learning goal
const calculateWeeklyGoal = async (userId) => {
  const UserRoadmap = require('../models/UserRoadmap');
  const roadmaps = await UserRoadmap.find({ userId });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyMinutes = roadmaps
    .filter(r => r.lastAccessed >= oneWeekAgo)
    .reduce((sum, r) => sum + (r.totalTimeSpent || 0), 0);

  const weeklyGoal = 420; // 7 hours * 60 minutes = 420 minutes
  const percentage = Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100));

  return {
    targetMinutes: weeklyGoal,
    currentMinutes: weeklyMinutes,
    percentage,
    met: weeklyMinutes >= weeklyGoal
  };
};

// Helper function to calculate monthly learning goal
const calculateMonthlyGoal = async (userId) => {
  const UserRoadmap = require('../models/UserRoadmap');
  const roadmaps = await UserRoadmap.find({ userId });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const monthlyMinutes = roadmaps
    .filter(r => r.lastAccessed >= oneMonthAgo)
    .reduce((sum, r) => sum + (r.totalTimeSpent || 0), 0);

  const monthlyGoal = 1800; // 30 hours * 60 minutes = 1800 minutes
  const percentage = Math.min(100, Math.round((monthlyMinutes / monthlyGoal) * 100));

  return {
    targetMinutes: monthlyGoal,
    currentMinutes: monthlyMinutes,
    percentage,
    met: monthlyMinutes >= monthlyGoal
  };
};

module.exports = {
  startSession,
  endSession,
  getTimeAnalytics,
  getTimeBasedStreaks
};