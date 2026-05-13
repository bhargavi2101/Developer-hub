const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/socialController');

// User connection routes
router.post('/follow/:targetUserId', authMiddleware, followUser);
router.post('/unfollow/:targetUserId', authMiddleware, unfollowUser);
router.get('/connections', authMiddleware, getUserConnections);
router.post('/accept/:connectionId', authMiddleware, acceptFollowRequest);

// Post routes
router.post('/posts', authMiddleware, createPost);
router.get('/feed', authMiddleware, getUserFeed);
router.get('/feed/:userId', authMiddleware, getUserFeed);
router.post('/posts/:postId/like', authMiddleware, likePost);
router.get('/posts/:postId/comments', authMiddleware, getPostComments);
router.post('/posts/:postId/comments', authMiddleware, addComment);

// User search
router.get('/search', authMiddleware, searchUsers);

// Statistics
router.get('/statistics', authMiddleware, getSocialStatistics);

module.exports = router;