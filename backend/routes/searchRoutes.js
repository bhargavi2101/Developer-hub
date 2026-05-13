const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  searchUsers,
  searchTechnologies,
  searchPosts,
  searchForums,
  globalSearch,
  getAutocompleteSuggestions,
  getAvailableFilters,
  clearSearchCache
} = require('../controllers/searchController');

// Public search routes (no authentication required)
router.get('/global', globalSearch);
router.get('/autocomplete', getAutocompleteSuggestions);
router.get('/filters/:type', getAvailableFilters);

// Protected search routes (authentication required)
router.get('/users', authMiddleware, searchUsers);
router.get('/technologies', authMiddleware, searchTechnologies);
router.get('/posts', authMiddleware, searchPosts);
router.get('/forums', authMiddleware, searchForums);

// Admin route to clear search cache
router.delete('/cache', authMiddleware, clearSearchCache);

module.exports = router;