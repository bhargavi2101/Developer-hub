const UserConnection = require('../models/UserConnection');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Follow user
const followUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (userId === targetUserId) {
      return res.status(400).json({ msg: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if already following
    const existingConnection = await UserConnection.findOne({
      userId,
      connectedUserId: targetUserId
    });

    if (existingConnection) {
      return res.status(400).json({ msg: 'Already following this user' });
    }

    // Check if target user allows followers
    if (!targetUser.social?.allowFollowers) {
      return res.status(403).json({ msg: 'This user does not allow followers' });
    }

    // Create connection (pending)
    const connection = new UserConnection({
      userId,
      connectedUserId: targetUserId,
      status: 'pending'
    });

    await connection.save();

    // Auto-accept if no approval needed
    const user = await User.findById(userId);
    const mutualConnection = await UserConnection.findOne({
      userId: targetUserId,
      connectedUserId: userId
    });

    if (mutualConnection && mutualConnection.status === 'accepted') {
      connection.status = 'accepted';
      connection.acceptedAt = new Date();
      await connection.save();
    }

    res.status(201).json(connection);
  } catch (error) {
    console.log('Follow user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Unfollow user
const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    const connection = await UserConnection.findOne({
      userId,
      connectedUserId: targetUserId
    });

    if (!connection) {
      return res.status(404).json({ msg: 'Not following this user' });
    }

    await UserConnection.findByIdAndDelete(connection._id);
    res.status(200).json({ msg: 'Unfollowed successfully' });
  } catch (error) {
    console.log('Unfollow user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's connections
const getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const followers = await UserConnection.find({ connectedUserId: userId, status: 'accepted' })
      .populate('userId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 });

    const following = await UserConnection.find({ userId, status: 'accepted' })
      .populate('connectedUserId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 });

    // Count pending requests
    const pendingRequests = await UserConnection.find({ connectedUserId: userId, status: 'pending' });

    res.status(200).json({
      followers,
      following,
      followerCount: followers.length,
      followingCount: following.length,
      pendingRequests
    });
  } catch (error) {
    console.log('Get user connections error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Accept follow request
const acceptFollowRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { connectionId } = req.params;

    const connection = await UserConnection.findOne({
      _id: connectionId,
      connectedUserId: userId
    });

    if (!connection) {
      return res.status(404).json({ msg: 'Follow request not found' });
    }

    connection.status = 'accepted';
    connection.acceptedAt = new Date();
    await connection.save();

    // Create mutual connection
    const mutualConnection = new UserConnection({
      userId: connection.userId,
      connectedUserId: userId,
      status: 'accepted'
    });
    await mutualConnection.save();

    res.status(200).json({ msg: 'Follow request accepted' });
  } catch (error) {
    console.log('Accept follow request error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create post
const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, type, visibility, tags, media } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ msg: 'Post content is required' });
    }

    const post = new Post({
      userId,
      content,
      type: type || 'text',
      visibility: visibility || 'public',
      tags: tags || [],
      media: media || []
    });

    await post.save();

    // Extract and process mentions
    if (content.includes('@')) {
      const mentions = content.match(/@(\w+)/g);
      if (mentions) {
        const usernames = mentions.map(m => m[1]);
        const mentionedUsers = await User.find({ username: { $in: usernames } });

        for (const user of mentionedUsers) {
          if (user && !post.mentions.includes(user._id)) {
            post.mentions.push(user._id);
          }
        }
        await post.save();
      }
    }

    res.status(201).json(post);
  } catch (error) {
    console.log('Create post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's feed
const getUserFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    // Get all user's connections
    const connections = await UserConnection.find({ userId, status: 'accepted' });
    const connectedUserIds = [userId, ...connections.map(c => c.connectedUserId.toString())];

    // Get posts from user and connections
    const posts = await Post.find({
      userId: { $in: connectedUserIds },
      visibility: { $in: ['public', 'followers-only'] }
    })
      .populate('userId', 'username firstName lastName avatar')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json(posts);
  } catch (error) {
    console.log('Get user feed error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like post
const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if already liked
    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ liked: !post.likes.includes(userId), likeCount: post.likes.length });
  } catch (error) {
    console.log('Like post error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add comment to post
const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ msg: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const commentData = {
      postId,
      userId,
      content,
      parentCommentId: parentCommentId || null,
      depth: parentCommentId ? 1 : 0
    };

    const comment = new Comment(commentData);
    await comment.save();

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    console.log('Add comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get comments for post
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate('userId', 'username firstName lastName avatar')
      .sort({ createdAt: 1 }); // Oldest first for threaded comments

    // Organize comments into threads
    const topLevelComments = comments.filter(c => !c.parentCommentId);
    const threadMap = new Map();
    comments.forEach(c => {
      if (c.parentCommentId) {
        if (!threadMap.has(c.parentCommentId)) {
          threadMap.set(c.parentCommentId, []);
        }
        threadMap.get(c.parentCommentId).push(c);
      }
    });

    const commentThreads = topLevelComments.map(c => ({
      comment: c,
      replies: threadMap.get(c._id) || []
    }));

    res.status(200).json(commentThreads);
  } catch (error) {
    console.log('Get post comments error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { 'preferences.skills': { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .select('username firstName lastName avatar skills interests')
      .limit(10);

    res.status(200).json({ users, count: users.length });
  } catch (error) {
    console.log('Search users error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get social statistics
const getSocialStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const followerCount = await UserConnection.countDocuments({ connectedUserId: userId, status: 'accepted' });
    const followingCount = await UserConnection.countDocuments({ userId, status: 'accepted' });
    const postCount = await Post.countDocuments({ userId });
    const totalLikes = await Post.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    const recentActivity = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      followerCount,
      followingCount,
      postCount,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      recentActivity
    });
  } catch (error) {
    console.log('Get social statistics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getUserConnections,
  acceptFollowRequest,
  createPost,
  getUserFeed,
  likePost,
  addComment,
  getPostComments,
  searchUsers,
  getSocialStatistics
};