const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/forumController');

// Forum CRUD operations
router.post('/', authMiddleware, createForum);
router.get('/technology/:technologyId', authMiddleware, getTechnologyForums);
router.get('/:forumId', authMiddleware, getForumWithReplies);
router.get('/', authMiddleware, searchForums);

// Reply operations
router.post('/:forumId/replies', authMiddleware, addReply);
router.post('/replies/:replyId/like', authMiddleware, likeReply);
router.post('/replies/:replyId/accept', authMiddleware, acceptAnswer);

// Moderation operations
router.patch('/:forumId/pin', authMiddleware, togglePinForum);
router.patch('/:forumId/lock', authMiddleware, toggleLockForum);
router.post('/:forumId/report', authMiddleware, reportContent);
router.post('/replies/:replyId/report', authMiddleware, reportContent);

module.exports = router;