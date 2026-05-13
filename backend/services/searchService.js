const Fuse = require('fuse.js');
const User = require('../models/User');
const Technology = require('../models/Technology');
const Post = require('../models/Post');
const Forum = require('../models/Forum');
const UserRoadmap = require('../models/UserRoadmap');

// Advanced search service with fuzzy matching and filtering
class SearchService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Search users with advanced filters
  async searchUsers(query, filters = {}) {
    const cacheKey = `users:${query}:${JSON.stringify(filters)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let searchQuery = {
      isBanned: { $ne: true }
    };

    // Basic text search with regex for partial matching
    if (query) {
      const regex = new RegExp(query, 'i');
      searchQuery.$or = [
        { username: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { email: { $regex: regex } },
        { skills: { $regex: regex } }
      ];
    }

    // Apply filters
    if (filters.location) {
      searchQuery.location = { $regex: new RegExp(filters.location, 'i') };
    }
    if (filters.skills && filters.skills.length > 0) {
      searchQuery.skills = { $in: filters.skills };
    }
    if (filters.minPoints) {
      searchQuery.totalPoints = { $gte: filters.minPoints };
    }
    if (filters.interests && filters.interests.length > 0) {
      searchQuery.interests = { $in: filters.interests };
    }

    const users = await User.find(searchQuery)
      .select('username firstName lastName avatar location skills interests totalPoints isAdmin createdAt')
      .limit(filters.limit || 20)
      .skip(filters.offset || 0)
      .sort(this.getSortOption(filters.sortBy))
      .lean();

    const result = {
      data: users,
      total: await User.countDocuments(searchQuery),
      filters: this.getAvailableFilters('users')
    };

    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

    return result;
  }

  // Search technologies/roadmaps with advanced filters
  async searchTechnologies(query, filters = {}) {
    const cacheKey = `technologies:${query}:${JSON.stringify(filters)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let searchQuery = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      searchQuery.$or = [
        { technology: { $regex: regex } },
        { category: { $regex: regex } },
        { overview: { $regex: regex } }
      ];
    }

    // Apply filters
    if (filters.category) {
      searchQuery.category = { $regex: new RegExp(filters.category, 'i') };
    }
    if (filters.levels && filters.levels.length > 0) {
      searchQuery.levels = { $in: filters.levels };
    }
    if (filters.difficulty) {
      searchQuery.levels = { $in: [filters.difficulty] };
    }

    const technologies = await Technology.find(searchQuery)
      .limit(filters.limit || 20)
      .skip(filters.offset || 0)
      .sort(this.getSortOption(filters.sortBy))
      .lean();

    // Add popularity metrics
    const technologiesWithStats = await Promise.all(
      technologies.map(async (tech) => {
        const enrolledCount = await UserRoadmap.countDocuments({
          technologyId: tech._id,
          status: { $ne: 'cancelled' }
        });
        return {
          ...tech,
          enrolledCount,
          popularity: enrolledCount
        };
      })
    );

    const result = {
      data: technologiesWithStats,
      total: await Technology.countDocuments(searchQuery),
      filters: this.getAvailableFilters('technologies')
    };

    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

    return result;
  }

  // Search posts from social feed
  async searchPosts(query, filters = {}) {
    const cacheKey = `posts:${query}:${JSON.stringify(filters)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let searchQuery = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      searchQuery.$or = [
        { content: { $regex: regex } },
        { tags: { $regex: regex } }
      ];
    }

    // Apply filters
    if (filters.tags && filters.tags.length > 0) {
      searchQuery.tags = { $in: filters.tags };
    }
    if (filters.type) {
      searchQuery.type = filters.type;
    }
    if (filters.visibility) {
      searchQuery.visibility = filters.visibility;
    }
    if (filters.userId) {
      searchQuery.userId = filters.userId;
    }

    const posts = await Post.find(searchQuery)
      .populate('userId', 'username firstName lastName avatar')
      .populate('comments.userId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .skip(filters.offset || 0)
      .lean();

    const result = {
      data: posts,
      total: await Post.countDocuments(searchQuery),
      filters: this.getAvailableFilters('posts')
    };

    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

    return result;
  }

  // Search forum discussions
  async searchForums(query, filters = {}) {
    const cacheKey = `forums:${query}:${JSON.stringify(filters)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let searchQuery = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      searchQuery.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $regex: regex } }
      ];
    }

    // Apply filters
    if (filters.technologyId) {
      searchQuery.technologyId = filters.technologyId;
    }
    if (filters.category) {
      searchQuery.category = filters.category;
    }
    if (filters.tags && filters.tags.length > 0) {
      searchQuery.tags = { $in: filters.tags };
    }

    const forums = await Forum.find(searchQuery)
      .populate('userId', 'username firstName lastName avatar')
      .populate('replies.userId', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .skip(filters.offset || 0)
      .lean();

    const result = {
      data: forums,
      total: await Forum.countDocuments(searchQuery),
      filters: this.getAvailableFilters('forums')
    };

    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

    return result;
  }

  // Global search across all entities
  async globalSearch(query, filters = {}) {
    if (!query || query.trim().length < 2) {
      return {
        users: [],
        technologies: [],
        posts: [],
        forums: [],
        total: 0
      };
    }

    const [users, technologies, posts, forums] = await Promise.all([
      this.searchUsers(query, { ...filters, limit: 5 }),
      this.searchTechnologies(query, { ...filters, limit: 5 }),
      this.searchPosts(query, { ...filters, limit: 5 }),
      this.searchForums(query, { ...filters, limit: 5 })
    ]);

    return {
      users: users.data,
      technologies: technologies.data,
      posts: posts.data,
      forums: forums.data,
      total: users.total + technologies.total + posts.total + forums.total,
      query: query
    };
  }

  // Autocomplete suggestions
  async getAutocompleteSuggestions(query, type = 'all') {
    if (!query || query.trim().length < 2) {
      return { suggestions: [] };
    }

    const regex = new RegExp(`^${query}`, 'i');
    let suggestions = [];

    if (type === 'all' || type === 'users') {
      const userSuggestions = await User.find({
        $or: [
          { username: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } }
        ],
        isBanned: { $ne: true }
      })
        .select('username firstName lastName avatar')
        .limit(5)
        .lean();

      userSuggestions.forEach(user => {
        suggestions.push({
          type: 'user',
          id: user._id,
          text: `${user.firstName} ${user.lastName} (@${user.username})`,
          avatar: user.avatar,
          username: user.username
        });
      });
    }

    if (type === 'all' || type === 'technologies') {
      const techSuggestions = await Technology.find({
        $or: [
          { technology: { $regex: regex } },
          { category: { $regex: regex } }
        ]
      })
        .select('technology category')
        .limit(5)
        .lean();

      techSuggestions.forEach(tech => {
        suggestions.push({
          type: 'technology',
          id: tech._id,
          text: `${tech.technology} (${tech.category})`,
          category: tech.category
        });
      });
    }

    return {
      suggestions: suggestions.slice(0, 10),
      query
    };
  }

  // Get available filters for search
  getAvailableFilters(type) {
    const filters = {
      users: {
        location: 'string',
        skills: 'array',
        interests: 'array',
        minPoints: 'number',
        sortBy: ['username', 'points', 'createdAt']
      },
      technologies: {
        category: 'string',
        levels: 'array',
        difficulty: 'string',
        sortBy: ['popularity', 'name', 'createdAt']
      },
      posts: {
        tags: 'array',
        type: 'string',
        visibility: 'string',
        sortBy: ['date', 'likes', 'comments']
      },
      forums: {
        technologyId: 'string',
        category: 'string',
        tags: 'array',
        sortBy: ['date', 'replies', 'likes']
      }
    };

    return filters[type] || {};
  }

  // Get sort options
  getSortOption(sortBy) {
    const sortOptions = {
      username: { username: 1 },
      points: { totalPoints: -1 },
      createdAt: { createdAt: -1 },
      popularity: { enrolledCount: -1 },
      name: { technology: 1 },
      date: { createdAt: -1 },
      likes: { likesCount: -1 },
      comments: { commentsCount: -1 },
      replies: { repliesCount: -1 }
    };

    return sortOptions[sortBy] || { createdAt: -1 };
  }

  // Clear search cache
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Search analytics
  async logSearch(userId, query, type, resultsCount, filters = {}) {
    // This would be implemented with a SearchAnalytics model
    // For now, we'll just log to console
    console.log('Search logged:', {
      userId,
      query,
      type,
      resultsCount,
      filters,
      timestamp: new Date()
    });
  }
}

module.exports = new SearchService();