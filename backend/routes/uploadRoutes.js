const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadAvatar, uploadSingle } = require('../controllers/uploadController');

// Upload avatar (protected route)
router.post('/avatar', authMiddleware, uploadSingle, uploadAvatar);

module.exports = router;