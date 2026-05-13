const cache = require('../utils/cache');
const redisCache = require('../utils/redisCache');

// Choose cache implementation based on environment
const useRedis = process.env.REDIS_ENABLED === 'true';
const cacheImpl = useRedis ? redisCache : cache;

// Connect to Redis if enabled
if (useRedis) {
  redisCache.connect().catch(console.error);
}

// Cache middleware factory
const cacheMiddleware = (keyPrefix, ttl = 300) => {
  return async (req, res, next) => {
    try {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Generate cache key
      const cacheKey = `${keyPrefix}:${req.originalUrl}`;

      // Try to get from cache
      const cachedData = cacheImpl.get(cacheKey);
      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.status(200).json(cachedData);
      }

      console.log(`Cache MISS: ${cacheKey}`);

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = function(data) {
        // Only cache successful responses
        if (res.statusCode === 200) {
          cacheImpl.set(cacheKey, data, ttl);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without caching on error
    }
  };
};

// Cache invalidation helper
const invalidateCache = async (pattern) => {
  try {
    if (useRedis) {
      await cacheImpl.deletePattern(pattern);
    } else {
      cacheImpl.deletePattern(pattern);
    }
    console.log(`Cache invalidated: ${pattern}`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

// Get cache statistics
const getCacheStats = async (req, res) => {
  try {
    const stats = cacheImpl.getStats();
    res.status(200).json({
      type: useRedis ? 'Redis' : 'In-Memory',
      connected: useRedis ? redisCache.connected : true,
      ...stats
    });
  } catch (error) {
    console.error('Get cache stats error:', error);
    res.status(500).json({ msg: 'Failed to get cache stats' });
  }
};

// Clear all cache
const clearCache = async (req, res) => {
  try {
    cacheImpl.clear();
    res.status(200).json({ msg: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ msg: 'Failed to clear cache' });
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  getCacheStats,
  clearCache
};
