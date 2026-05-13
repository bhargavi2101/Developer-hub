const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'error.log');
  }

  // Format log entry
  formatLog(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    return JSON.stringify(logEntry) + '\n';
  }

  // Write to file
  writeToFile(file, content) {
    try {
      fs.appendFileSync(file, content, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  // Log levels
  info(message, meta = {}) {
    const logEntry = this.formatLog('INFO', message, meta);
    console.log(`[INFO] ${message}`);
    this.writeToFile(this.logFile, logEntry);
  }

  warn(message, meta = {}) {
    const logEntry = this.formatLog('WARN', message, meta);
    console.warn(`[WARN] ${message}`);
    this.writeToFile(this.logFile, logEntry);
  }

  error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      error: error ? {
        message: error.message,
        stack: error.stack
      } : null
    };

    const logEntry = this.formatLog('ERROR', message, errorMeta);
    console.error(`[ERROR] ${message}`);
    this.writeToFile(this.errorFile, logEntry);
    this.writeToFile(this.logFile, logEntry);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this.formatLog('DEBUG', message, meta);
      console.debug(`[DEBUG] ${message}`);
      this.writeToFile(this.logFile, logEntry);
    }
  }

  // Request logging middleware
  requestLogger(req, res, next) {
    const startTime = Date.now();

    // Log request
    this.info('Incoming request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    // Override res.end to log response
    const originalEnd = res.end.bind(res);

    res.end = function(...args) {
      const duration = Date.now() - startTime;

      logger.info('Request completed', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });

      originalEnd.apply(res, args);
    };

    next();
  }

  // Clean old log files (older than 30 days)
  cleanOldLogs() {
    try {
      const files = fs.readdirSync(logsDir);
      const now = Date.now();
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          logger.info('Deleted old log file', { file });
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', error);
    }
  }
}

// Export singleton instance
const logger = new Logger();

// Clean old logs on startup
logger.cleanOldLogs();

module.exports = logger;
