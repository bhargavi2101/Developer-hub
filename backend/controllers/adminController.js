const User = require('../models/User');
const UserRoadmap = require('../models/UserRoadmap');
const Technology = require('../models/Technology');
const SubTechnology = require('../models/SubTechnology');
const Forum = require('../models/Forum');
const Post = require('../models/Post');
const AdminLog = require('../models/AdminLog');

// Helper function to create admin log
const createLog = async (adminId, action, targetType, targetId, targetName, description, changes, status = 'SUCCESS', errorMessage = null) => {
  try {
    const log = new AdminLog({
      adminId,
      action,
      targetType,
      targetId,
      targetName,
      description,
      changes,
      status,
      errorMessage
    });
    await log.save();
  } catch (error) {
    console.error('Error creating admin log:', error);
  }
};

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    // Get all statistics in parallel
    const [
      totalUsers,
      activeUsers,
      totalRoadmaps,
      completedRoadmaps,
      totalLessons,
      completedLessons,
      totalPosts,
      totalForums,
      totalReplies,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      UserRoadmap.countDocuments(),
      UserRoadmap.countDocuments({ status: 'completed' }),
      SubTechnology.countDocuments(),
      UserRoadmap.aggregate([
        { $unwind: '$progress' },
        { $match: { 'progress.status': 'completed' } },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      Post.countDocuments(),
      Forum.countDocuments(),
      require('../models/ForumReply').countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
    ]);

    res.status(200).json({
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth
      },
      roadmaps: {
        total: totalRoadmaps,
        completed: completedRoadmaps,
        completionRate: totalRoadmaps > 0 ? ((completedRoadmaps / totalRoadmaps) * 100).toFixed(1) : 0
      },
      lessons: {
        total: totalLessons,
        completed: completedLessons,
        completionRate: totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(1) : 0
      },
      community: {
        totalPosts,
        totalForums,
        totalReplies
      }
    });
  } catch (error) {
    console.log('Get dashboard stats error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const { page = 1, limit = 20, search = '', role = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }
    if (role === 'admin') {
      query.isAdmin = true;
    } else if (role === 'user') {
      query.isAdmin = false;
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log('Get all users error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user role (make admin/remove admin)
const updateUserRole = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { userId } = req.params;
    const { isAdmin } = req.body;

    // Check if current user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    // Cannot change own role
    if (userId === adminId) {
      return res.status(400).json({ msg: 'Cannot change your own admin status' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const previousStatus = user.isAdmin;
    user.isAdmin = isAdmin;
    await user.save();

    // Log the action
    await createLog(
      adminId,
      'UPDATE_USER_ROLE',
      'user',
      userId,
      user.username,
      `Changed ${user.username}'s admin status from ${previousStatus} to ${isAdmin}`,
      { previousStatus, newStatus: isAdmin }
    );

    res.status(200).json({
      msg: 'User role updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.log('Update user role error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Ban/Unban user
const toggleUserBan = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { userId } = req.params;
    const { reason, action } = req.body; // action: 'ban' or 'unban'

    // Check if current user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    // Cannot ban yourself
    if (userId === adminId) {
      return res.status(400).json({ msg: 'Cannot ban yourself' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (action === 'ban') {
      user.isBanned = true;
      user.bannedAt = new Date();
      user.banReason = reason || 'No reason provided';

      // Log the action
      await createLog(
        adminId,
        'BAN_USER',
        'user',
        userId,
        user.username,
        `Banned user ${user.username}`,
        { reason }
      );
    } else if (action === 'unban') {
      user.isBanned = false;
      user.bannedAt = null;
      user.banReason = null;

      // Log the action
      await createLog(
        adminId,
        'UNBAN_USER',
        'user',
        userId,
        user.username,
        `Unbanned user ${user.username}`,
        {}
      );
    }

    await user.save();

    res.status(200).json({
      msg: `User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    console.log('Toggle user ban error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { userId } = req.params;

    // Check if current user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    // Cannot delete yourself
    if (userId === adminId) {
      return res.status(400).json({ msg: 'Cannot delete yourself' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete user and related data
    await User.deleteOne({ _id: userId });
    await UserRoadmap.deleteMany({ userId });
    await Post.deleteMany({ userId });
    await ForumReply.deleteMany({ userId });
    await Forum.deleteMany({ createdBy: userId });

    // Log the action
    await createLog(
      adminId,
      'DELETE_USER',
      'user',
      userId,
      user.username,
      `Deleted user ${user.username}`,
      { username: user.username, email: user.email }
    );

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.log('Delete user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get admin logs
const getAdminLogs = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const { page = 1, limit = 20, action = '', targetType = '', adminId: filterAdminId = '' } = req.query;

    // Build query
    const query = {};
    if (action) query.action = action;
    if (targetType) query.targetType = targetType;
    if (filterAdminId) query.adminId = filterAdminId;

    const logs = await AdminLog.find(query)
      .populate('adminId', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AdminLog.countDocuments(query);

    res.status(200).json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log('Get admin logs error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Moderate content (delete post/forum/reply)
const moderateContent = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { type, id, reason } = req.body;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    let content;
    let targetName;
    let action;

    switch (type) {
      case 'post':
        content = await Post.findById(id);
        if (content) {
          targetName = content.content.substring(0, 50) + '...';
          action = 'MODERATE_CONTENT';
          await Post.deleteOne({ _id: id });
        }
        break;

      case 'forum':
        content = await Forum.findById(id);
        if (content) {
          targetName = content.title;
          action = 'MODERATE_CONTENT';
          await Forum.deleteOne({ _id: id });
        }
        break;

      case 'reply':
        const ForumReply = require('../models/ForumReply');
        content = await ForumReply.findById(id);
        if (content) {
          targetName = content.content.substring(0, 50) + '...';
          action = 'MODERATE_CONTENT';
          await ForumReply.deleteOne({ _id: id });
        }
        break;

      default:
        return res.status(400).json({ msg: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }

    // Log the action
    await createLog(
      adminId,
      action,
      'content',
      id,
      targetName,
      `Moderated ${type}: ${reason || 'No reason provided'}`,
      { type, reason }
    );

    res.status(200).json({ msg: 'Content removed successfully' });
  } catch (error) {
    console.log('Moderate content error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get flagged/reported content
const getFlaggedContent = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const { type = 'all' } = req.query;

    let flaggedContent = [];

    if (type === 'all' || type === 'posts') {
      const flaggedPosts = await Post.find({ isFlagged: true })
        .populate('userId', 'username firstName lastName avatar')
        .sort({ flaggedAt: -1 })
        .limit(50);
      flaggedContent = flaggedPosts.map(post => ({
        type: 'post',
        _id: post._id,
        content: post.content,
        user: post.userId,
        createdAt: post.createdAt,
        flaggedAt: post.flagedAt,
        flagReason: post.flagReason
      }));
    }

    if (type === 'all' || type === 'forums') {
      const flaggedForums = await Forum.find({ isFlagged: true })
        .populate('createdBy', 'username firstName lastName avatar')
        .sort({ flaggedAt: -1 })
        .limit(50);
      flaggedContent = [
        ...flaggedContent,
        ...flaggedForums.map(forum => ({
          type: 'forum',
          _id: forum._id,
          content: forum.title,
          user: forum.createdBy,
          createdAt: forum.createdAt,
          flaggedAt: forum.flagedAt,
          flagReason: forum.flagReason
        }))
      ];
    }

    if (type === 'all' || type === 'replies') {
      const ForumReply = require('../models/ForumReply');
      const flaggedReplies = await ForumReply.find({ isReported: true })
        .populate('userId', 'username firstName lastName avatar')
        .sort({ createdAt: -1 })
        .limit(50);
      flaggedContent = [
        ...flaggedContent,
        ...flaggedReplies.map(reply => ({
          type: 'reply',
          _id: reply._id,
          content: reply.content,
          user: reply.userId,
          createdAt: reply.createdAt,
          reportedBy: reply.reportedBy.length
        }))
      ];
    }

    res.status(200).json({
      content: flaggedContent.sort((a, b) => new Date(b.flaggedAt || b.createdAt) - new Date(a.flaggedAt || a.createdAt)),
      count: flaggedContent.length
    });
  } catch (error) {
    console.log('Get flagged content error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get system analytics
const getSystemAnalytics = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

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

    // Get user registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get engagement metrics
    const engagementMetrics = await Promise.all([
      Post.countDocuments({ createdAt: { $gte: startDate } }),
      Forum.countDocuments({ createdAt: { $gte: startDate } }),
      require('../models/ForumReply').countDocuments({ createdAt: { $gte: startDate } })
    ]);

    res.status(200).json({
      period,
      userTrends,
      engagement: {
        posts: engagementMetrics[0],
        forums: engagementMetrics[1],
        replies: engagementMetrics[2]
      }
    });
  } catch (error) {
    console.log('Get system analytics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserBan,
  deleteUser,
  getAdminLogs,
  moderateContent,
  getFlaggedContent,
  getSystemAnalytics
};
