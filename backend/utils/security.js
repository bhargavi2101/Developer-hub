const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class Security {
  // Generate secure random token
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate CSRF token
  static generateCSRFToken() {
    return this.generateToken(16);
  }

  // Hash a value using SHA-256
  static hash(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  // Compare hash
  static compareHash(value, hash) {
    return this.hash(value) === hash;
  }

  // Generate secure password reset token
  static generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isStrongPassword(password) {
    if (password.length < 8) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  }

  // Sanitize filename
  static sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Generate signature for verification
  static generateSignature(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(data))
      .digest('hex');
  }

  // Verify signature
  static verifySignature(data, signature, secret) {
    const expectedSignature = this.generateSignature(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  // Escape HTML to prevent XSS
  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Validate URL
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Mask sensitive data
  static maskEmail(email) {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  }

  // Mask sensitive data
  static maskPhoneNumber(phone) {
    if (phone.length < 4) return phone;
    return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
  }

  // Generate API key
  static generateApiKey() {
    const prefix = 'dkh_'; // Developer Hub
    const randomPart = this.generateToken(24);
    return `${prefix}${randomPart}`;
  }

  // Validate API key format
  static isValidApiKey(apiKey) {
    return /^dkh_[a-f0-9]{48}$/.test(apiKey);
  }

  // Rate limiting key generator
  static generateRateLimitKey(identifier, action) {
    return `ratelimit:${action}:${identifier}`;
  }

  // Session token generation
  static generateSessionToken() {
    return {
      token: this.generateToken(32),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
  }

  // Validate session token
  static isSessionValid(expiresAt) {
    return Date.now() < expiresAt;
  }
}

module.exports = Security;
