const User = require('../models/User');
const UserRoadmap = require('../models/UserRoadmap');
const LearningSession = require('../models/LearningSession');
const UserActivity = require('../models/UserActivity');
const SubTechnology = require('../models/SubTechnology');

// Get user learning patterns
const getLearningPatterns = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query;

    let startDate;
    const endDate = new Date();

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get learning sessions for the period
    const sessions = await LearningSession.find({
      userId,
      startTime: { $gte: startDate, $lte: endDate }
    })
      .populate('technologyId', 'name category')
      .populate('subTechnologyId', 'name')
      .sort({ startTime: -1 });

    // Get learning time by day
    const learningByDay = [];
    for (let i = period === '7d' ? 7 : 30; i >= 0; i--) {
      const day = new Date(endDate);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySessions = sessions.filter(session =>
        session.startTime >= day && session.startTime < nextDay
      );

      const totalDuration = daySessions.reduce((sum, session) => sum + (session.duration || 0), 0);

      learningByDay.push({
        date: day.toISOString().split('T')[0],
        duration: Math.floor(totalDuration / 60), // convert to minutes
        sessions: daySessions.length
      });
    }

    // Get learning time by technology
    const learningByTechnology = {};
    sessions.forEach(session => {
      const techId = session.technologyId._id.toString();
      if (!learningByTechnology[techId]) {
        learningByTechnology[techId] = {
          technology: session.technologyId,
          duration: 0,
          sessions: 0
        };
      }
      learningByTechnology[techId].duration += session.duration || 0;
      learningByTechnology[techId].sessions += 1;
    });

    const technologyStats = Object.values(learningByTechnology).map(stat => ({
      ...stat,
      duration: Math.floor(stat.duration / 60) // convert to minutes
    })).sort((a, b) => b.duration - a.duration);

    // Get learning by hour of day
    const learningByHour = new Array(24).fill(0);
    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      learningByHour[hour] += session.duration || 0;
    });

    // Total stats
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const completedLessons = sessions.filter(s => s.completionStatus === 'completed').length;
    const averageSessionDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;

    res.status(200).json({
      period,
      summary: {
        totalDuration: Math.floor(totalDuration / 60), // minutes
        totalSessions: sessions.length,
        completedLessons,
        averageSessionDuration: Math.floor(averageSessionDuration / 60), // minutes
        activeDays: learningByDay.filter(day => day.duration > 0).length
      },
      learningByDay,
      learningByTechnology: technologyStats,
      learningByHour: learningByHour.map(duration => Math.floor(duration / 60))
    });
  } catch (error) {
    console.log('Get learning patterns error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get progress timeline
const getProgressTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user roadmaps with progress
    const roadmaps = await UserRoadmap.find({ userId })
      .populate('technologyId', 'name category color')
      .sort({ createdAt: -1 });

    // Get progress over time
    const timeline = await UserActivity.find({
      userId,
      activityType: { $in: ['LESSON_COMPLETE', 'QUIZ_COMPLETE'] }
    })
      .sort({ createdAt: -1 })
      .limit(50);

    // Get milestone achievements
    const milestones = await UserActivity.find({
      userId,
      activityType: 'EARN_BADGE'
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // Calculate completion percentage for each roadmap
    const roadmapProgress = await Promise.all(
      roadmaps.map(async (roadmap) => {
        const totalLessons = await SubTechnology.countDocuments({
          technologyId: roadmap.technologyId._id,
          isActive: true
        });

        const completedLessons = roadmap.progress.filter(
          p => p.status === 'completed'
        ).length;

        return {
          ...roadmap.toObject(),
          totalLessons,
          completedLessons,
          completionPercentage: totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0
        };
      })
    );

    // Get recent activity summary
    const recentActivity = await UserActivity.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      roadmaps: roadmapProgress,
      timeline,
      milestones,
      recentActivity,
      summary: {
        totalRoadmaps: roadmaps.length,
        completedRoadmaps: roadmaps.filter(r => r.status === 'completed').length,
        inProgressRoadmaps: roadmaps.filter(r => r.status === 'in_progress').length,
        totalLessonsCompleted: roadmapProgress.reduce((sum, r) => sum + r.completedLessons, 0),
        totalMilestones: milestones.length
      }
    });
  } catch (error) {
    console.log('Get progress timeline error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get detailed statistics
const getDetailedStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    // Get all user roadmaps
    const roadmaps = await UserRoadmap.find({ userId })
      .populate('technologyId', 'name category');

    // Calculate statistics
    const totalLessons = await SubTechnology.countDocuments({
      technologyId: { $in: roadmaps.map(r => r.technologyId._id) },
      isActive: true
    });

    const completedLessons = roadmaps.reduce((sum, roadmap) => {
      return sum + roadmap.progress.filter(p => p.status === 'completed').length;
    }, 0);

    const totalQuizzes = await require('../models/QuizResult').countDocuments({ userId });
    const averageQuizScore = await require('../models/QuizResult').aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' }
        }
      }
    ]).then(result => result[0]?.averageScore || 0);

    const notes = await require('../models/UserNote').countDocuments({ userId });
    const posts = await require('../models/Post').countDocuments({ userId });
    const forumPosts = await require('../models/Forum').countDocuments({ createdBy: userId });

    const learningTime = await LearningSession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' }
        }
      }
    ]).then(result => result[0]?.totalDuration || 0);

    const streakData = {
      currentStreak: user.learningStreak || 0,
      lastLearningDate: user.lastLearningDate,
      longestStreak: user.longestStreak || 0
    };

    res.status(200).json({
      learning: {
        totalLessons,
        completedLessons,
        completionRate: totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(1) : 0,
        learningTime: Math.floor(learningTime / 60), // minutes
        learningDays: streakData.currentStreak
      },
      quizzes: {
        totalQuizzes,
        averageScore: Math.round(averageQuizScore)
      },
      engagement: {
        notes,
        posts,
        forumPosts,
        totalEngagement: notes + posts + forumPosts
      },
      achievements: {
        points: user.totalPoints || 0,
        badges: streakData.longestStreak,
        rank: await getUserRank(user.totalPoints || 0)
      },
      streak: streakData
    });
  } catch (error) {
    console.log('Get detailed statistics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to get user rank
const getUserRank = async (points) => {
  try {
    const rank = await User.countDocuments({
      totalPoints: { $gt: points }
    }) + 1;

    let rankTitle = 'Beginner';
    if (rank <= 10) rankTitle = 'Expert';
    else if (rank <= 50) rankTitle = 'Advanced';
    else if (rank <= 100) rankTitle = 'Intermediate';

    return {
      position: rank,
      title: rankTitle
    };
  } catch (error) {
    return { position: 0, title: 'Beginner' };
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { type = 'points', limit = 50 } = req.query;

    let sortField = 'totalPoints';
    if (type === 'streak') sortField = 'learningStreak';
    if (type === 'lessons') {
      sortField = 'completedLessons';
    }

    const users = await User.find({ isActive: true })
      .select('username firstName lastName avatar totalPoints learningStreak')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    // Calculate completed lessons for each user if needed
    let leaderboard;
    if (type === 'lessons') {
      leaderboard = await Promise.all(
        users.map(async (user) => {
          const completedLessons = await UserRoadmap.aggregate([
            { $match: { userId: user._id } },
            { $unwind: '$progress' },
            { $match: { 'progress.status': 'completed' } },
            { $count: 'total' }
          ]).then(result => result[0]?.total || 0);

          return {
            ...user.toObject(),
            completedLessons
          };
        })
      );

      leaderboard.sort((a, b) => b.completedLessons - a.completedLessons);
    } else {
      leaderboard = users;
    }

    res.status(200).json({
      type,
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
        learningStreak: user.learningStreak,
        completedLessons: user.completedLessons || 0
      }))
    });
  } catch (error) {
    console.log('Get leaderboard error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Track learning session
const trackLearningSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { technologyId, subTechnologyId, startTime, endTime, completionStatus, progressMade, metadata } = req.body;

    if (!technologyId || !startTime) {
      return res.status(400).json({ msg: 'Technology ID and start time are required' });
    }

    const session = new LearningSession({
      userId,
      technologyId,
      subTechnologyId,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      completionStatus,
      progressMade,
      metadata
    });

    await session.save();

    // Log activity
    await UserActivity.logActivity(userId, 'LESSON_START', {
      resourceType: 'lesson',
      resourceId: subTechnologyId,
      description: `Started learning session for technology`,
      metadata: { sessionId: session._id }
    });

    res.status(201).json(session);
  } catch (error) {
    console.log('Track learning session error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getLearningPatterns,
  getProgressTimeline,
  getDetailedStatistics,
  getLeaderboard,
  trackLearningSession
};
