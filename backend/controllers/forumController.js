const Forum = require('../models/Forum');
const ForumReply = require('../models/ForumReply');
const User = require('../models/User');

// Create forum topic
const createForum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { technologyId, subTechnologyId, title, description, category, tags, isPinned } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ msg: 'Forum title is required' });
    }

    if (!technologyId) {
      return res.status(400).json({ msg: 'technologyId is required' });
    }

    const forum = new Forum({
      userId,
      technologyId,
      subTechnologyId,
      title: title.trim(),
      description: description || '',
      category: category || 'discussion',
      tags: tags || [],
      isPinned: isPinned || false,
      createdBy: userId
    });

    await forum.save();

    // Update forum reply count
    await Forum.findByIdAndUpdate(forum._id, {
      $inc: { replyCount: 1 }
    });

    res.status(201).json(forum);
  } catch (error) {
    console.log('Create forum error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get forums for a technology
const getTechnologyForums = async (req, res) => {
  try {
    const { technologyId } = req.params;

    const forums = await Forum.find({ technologyId })
      .populate('createdBy', 'username firstName lastName avatar')
      .sort({ isPinned: -1, lastReplyAt: -1, createdAt: -1 });

    // Group replies by forum
    const forumIds = forums.map(f => f._id.toString());

    const replyCounts = await ForumReply.aggregate([
      { $match: { forumId: { $in: forumIds } } },
      { $group: { _id: '$forumId', count: { $sum: 1 } } }
    ]);

    const replyCountMap = new Map();
    replyCounts.forEach(item => {
      replyCountMap.set(item._id.toString(), item.count);
    });

    // Attach reply counts to forums
    const enrichedForums = forums.map(forum => ({
      ...forum.toObject(),
      replyCount: replyCountMap.get(forum._id.toString()) || 0,
      viewCount: forum.viewCount || 0
    }));

    res.status(200).json(enrichedForums);
  } catch (error) {
    console.log('Get technology forums error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get single forum with replies
const getForumWithReplies = async (req, res) => {
  try {
    const { forumId } = req.params;

    const forum = await Forum.findById(forumId)
      .populate('createdBy', 'username firstName lastName avatar');

    if (!forum) {
      return res.status(404).json({ msg: 'Forum not found' });
    }

    // Get all replies
    const allReplies = await ForumReply.find({ forumId })
      .populate('userId', 'username firstName lastName avatar')
      .sort({ createdAt: 1 });

    // Increment view count
    await Forum.findByIdAndUpdate(forumId, {
      $inc: { viewCount: 1 }
    });

    // Organize replies into thread structure
    const topLevelReplies = allReplies.filter(r => !r.parentReplyId);
    const replyMap = new Map();

    // Build reply tree
    allReplies.forEach(reply => {
      if (!reply.parentReplyId) {
        replyMap.set(reply._id.toString(), []);
      }
      if (reply.parentReplyId) {
        const parentThread = replyMap.get(reply.parentReplyId.toString());
        if (parentThread) {
          parentThread.push(reply);
        }
      }
    });

    // Convert Map to array
    const replyThreads = Array.from(replyMap.values());

    res.status(200).json({
      forum,
      topLevelReplies,
      replyThreads,
      totalReplies: allReplies.length
    });
  } catch (error) {
    console.log('Get forum with replies error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add reply to forum
const addReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const { forumId } = req.params;
    const { content, parentReplyId, codeBlocks } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ msg: 'Reply content is required' });
    }

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum not found' });
    }

    if (forum.isLocked) {
      return res.status(403).json({ msg: 'This forum is locked' });
    }

    // Handle parent reply and depth
    let parentDepth = 0;
    if (parentReplyId) {
      const parentReply = await ForumReply.findById(parentReplyId);
      if (parentReply) {
        parentDepth = parentReply.depth || 0;
        if (parentDepth >= 5) {
          return res.status(400). json({ msg: 'Maximum reply depth exceeded' });
        }
      }
    }

    const replyData = {
      forumId,
      userId,
      content,
      parentReplyId: parentReplyId || null,
      depth: parentDepth + 1,
      codeBlocks: codeBlocks || []
    };

    const reply = new ForumReply(replyData);
    await reply.save();

    // Update forum's reply count and last reply time
    await Forum.findByIdAndUpdate(forumId, {
      $inc: { replyCount: 1 },
      lastReplyAt: new Date()
    });

    res.status(201).json(reply);
  } catch (error) {
    console.log('Add reply error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like forum reply
const likeReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const { replyId } = req.params;

    const reply = await ForumReply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ msg: 'Reply not found' });
    }

    // Check if already liked
    if (reply.likes.includes(userId)) {
      // Unlike
      reply.likes = reply.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      reply.likes.push(userId);
    }

    await reply.save();
    res.status(200).json({
      liked: !reply.likes.includes(userId),
      likeCount: reply.likes.length
    });
  } catch (error) {
    console.log('Like reply error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Accept answer
const acceptAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { replyId } = req.params;

    const reply = await ForumReply.findById(replyId);
    const forum = await Forum.findById(reply.forumId);

    if (!reply || !forum) {
      return res.status(404).json({ msg: 'Reply or forum not found' });
    }

    // Only forum creator or OP can accept answers
    if (forum.createdBy.toString() !== userId) {
      return res.status(403).json({ msg: 'Only the original poster can accept answers' });
    }

    reply.isAcceptedAnswer = true;
    await reply.save();

    // Auto-accept other replies if this is the first reply
    await ForumReply.updateMany({
      _id: { $ne: replyId },
      forumId: reply.forumId,
      parentReplyId: reply.parentReplyId
    }, {
      isAcceptedAnswer: false
    });

    res.status(200).json({ msg: 'Answer marked as accepted' });
  } catch (error) {
    console.log('Accept answer error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Search forums
const searchForums = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
    }

    const forums = await Forum.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .populate('createdBy', 'username firstName lastName avatar')
      .limit(20)
      .sort({ createdAt: -1 });

    res.status(200).json({ forums, count: forums.length });
  } catch (error) {
    console.log('Search forums error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Pin/unpin forum
const togglePinForum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { forumId } = req.params;

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum not found' });
    }

    // Only admins and OP can pin/unpin
    if (forum.createdBy.toString() !== userId && !forum.createdBy?.isAdmin) {
      return res.status(403).json({ msg: 'Only the original poster can pin/unpin this forum' });
    }

    forum.isPinned = !forum.isPinned;
    await forum.save();

    res.status(200).json(forum);
  } catch (error) {
    console.log('Toggle pin forum error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Lock/unlock forum
const toggleLockForum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { forumId } = req.params;

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ msg: 'Forum not found' });
    }

    // Only admins can lock/unlock
    if (!forum.createdBy?.isAdmin) {
      return res.status(403).json({ msg: 'Only admins can lock/unlock this forum' });
    }

    forum.isLocked = !forum.isLocked;
    await forum.save();

    res.status(200).json(forum);
  } catch (error) {
    console.log('Toggle lock forum error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Report forum or reply
const reportContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { forumId, replyId, reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ msg: 'Reason must be at least 10 characters' });
    }

    if (forumId) {
      const forum = await Forum.findById(forumId);
      if (!forum) {
        return res.status(404).json({ msg: 'Forum not found' });
      }
      forum.reportedBy.push(userId);
      await forum.save();
    }

    if (replyId) {
      const reply = await ForumReply.findById(replyId);
      if (!reply) {
        return res.status(404).json({ msg: 'Reply not found' });
      }
      reply.reportedBy.push(userId);
      await reply.save();
    }

    res.status(200).json({ msg: 'Content reported successfully' });
  } catch (error) {
    console.log('Report content error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createForum,
  getTechnologyForums,
  getForumWithReplies,
  addReply,
  likeReply,
  acceptAnswer,
  searchForums,
  togglePinForum,
  toggleLockForum,
  reportContent
};