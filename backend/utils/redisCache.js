// Redis cache implementation for production
// Requires: npm install redis

const Redis = require('redis');

class RedisCache {
  constructor() {
    this.client = null;
    this.connected = false;
    this.defaultTTL = 300; // 5 minutes in seconds
  }

  async connect() {
    try {
      this.client = Redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.connected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.connected = false;
    }
  }

  async get(key) {
    if (!this.connected || !this.client) return null;

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    if (!this.connected || !this.client) return false;

    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async delete(key) {
    if (!this.connected || !this.client) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  async clear() {
    if (!this.connected || !this.client) return false;

    try {
      await this.client.flushDb();
      return true;
    } catch (error) {
      console.error('Redis clear error:', error);
      return false;
    }
  }

  async deletePattern(pattern) {
    if (!this.connected || !this.client) return false;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis delete pattern error:', error);
      return false;
    }
  }

  async getStats() {
    if (!this.connected || !this.client) {
      return { totalKeys: 0, activeKeys: 0, expiredKeys: 0 };
    }

    try {
      const info = await this.client.info('keyspace');
      // Parse Redis info to get key count
      const match = info.match(/db0:keys=(\d+)/);
      const totalKeys = match ? parseInt(match[1]) : 0;

      return {
        totalKeys,
        activeKeys: totalKeys,
        expiredKeys: 0
      };
    } catch (error) {
      console.error('Redis stats error:', error);
      return { totalKeys: 0, activeKeys: 0, expiredKeys: 0 };
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.connected = false;
    }
  }
}

// Export singleton instance
const redisCache = new RedisCache();

module.exports = redisCache;
