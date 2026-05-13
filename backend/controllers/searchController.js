const searchService = require('../services/searchService');
const authMiddleware = require('../middlewares/authMiddleware');

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q, location, skills, interests, minPoints, sortBy, limit = 20, offset = 0 } = req.query;

    const filters = {
      location,
      skills: skills ? skills.split(',') : [],
      interests: interests ? interests.split(',') : [],
      minPoints: minPoints ? parseInt(minPoints) : undefined,
      sortBy,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await searchService.searchUsers(q, filters);

    // Log search analytics
    if (req.user) {
      await searchService.logSearch(req.user._id, q, 'users', result.total, filters);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
};

// Search technologies
const searchTechnologies = async (req, res) => {
  try {
    const { q, category, levels, difficulty, sortBy, limit = 20, offset = 0 } = req.query;

    const filters = {
      category,
      levels: levels ? levels.split(',') : [],
      difficulty,
      sortBy,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await searchService.searchTechnologies(q, filters);

    // Log search analytics
    if (req.user) {
      await searchService.logSearch(req.user._id, q, 'technologies', result.total, filters);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search technologies error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search technologies'
    });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { q, tags, type, visibility, sortBy, limit = 20, offset = 0 } = req.query;

    const filters = {
      tags: tags ? tags.split(',') : [],
      type,
      visibility,
      sortBy,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await searchService.searchPosts(q, filters);

    // Log search analytics
    if (req.user) {
      await searchService.logSearch(req.user._id, q, 'posts', result.total, filters);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search posts'
    });
  }
};

// Search forums
const searchForums = async (req, res) => {
  try {
    const { q, technologyId, category, tags, sortBy, limit = 20, offset = 0 } = req.query;

    const filters = {
      technologyId,
      category,
      tags: tags ? tags.split(',') : [],
      sortBy,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await searchService.searchForums(q, filters);

    // Log search analytics
    if (req.user) {
      await searchService.logSearch(req.user._id, q, 'forums', result.total, filters);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search forums error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search forums'
    });
  }
};

// Global search across all entities
const globalSearch = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters long'
      });
    }

    const result = await searchService.globalSearch(q, { limit: parseInt(limit) });

    // Log search analytics
    if (req.user) {
      await searchService.logSearch(req.user._id, q, 'global', result.total, {});
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform global search'
    });
  }
};

// Get autocomplete suggestions
const getAutocompleteSuggestions = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const result = await searchService.getAutocompleteSuggestions(q, type);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get autocomplete suggestions'
    });
  }
};

// Get available filters
const getAvailableFilters = async (req, res) => {
  try {
    const { type } = req.params;

    const filters = searchService.getAvailableFilters(type);

    res.json({
      success: true,
      filters,
      type
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get available filters'
    });
  }
};

// Clear search cache (admin only)
const clearSearchCache = async (req, res) => {
  try {
    const { pattern } = req.query;

    searchService.clearCache(pattern);

    res.json({
      success: true,
      message: 'Search cache cleared successfully'
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear search cache'
    });
  }
};

module.exports = {
  searchUsers,
  searchTechnologies,
  searchPosts,
  searchForums,
  globalSearch,
  getAutocompleteSuggestions,
  getAvailableFilters,
  clearSearchCache
};