// Simple in-memory cache for development (can be replaced with Redis)
// In production, use Redis for distributed caching

class Cache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 300; // 5 minutes in seconds
  }

  // Get value from cache
  get(key) {
    try {
      const item = this.cache.get(key);
      if (!item) return null;

      // Check if expired
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set value in cache with optional TTL
  set(key, value, ttl = this.defaultTTL) {
    try {
      const expiry = Date.now() + (ttl * 1000);
      this.cache.set(key, { value, expiry });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete specific key
  delete(key) {
    try {
      return this.cache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear all cache
  clear() {
    try {
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Delete keys matching pattern
  deletePattern(pattern) {
    try {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  // Get cache statistics
  getStats() {
    try {
      let expired = 0;
      const now = Date.now();

      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
          expired++;
        }
      }

      return {
        totalKeys: this.cache.size,
        activeKeys: this.cache.size - expired,
        expiredKeys: expired
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { totalKeys: 0, activeKeys: 0, expiredKeys: 0 };
    }
  }
}

// Export singleton instance
const cache = new Cache();

module.exports = cache;
