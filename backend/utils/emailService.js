const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.enabled = false;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@developerhub.com';
  }

  async initialize() {
    try {
      // Check if email service is configured
      if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
        logger.warn('Email service not configured');
        this.enabled = false;
        return false;
      }

      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      // Verify connection
      await this.transporter.verify();
      this.enabled = true;
      logger.info('Email service initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize email service', error);
      this.enabled = false;
      return false;
    }
  }

  async sendEmail(to, subject, html, text = '') {
    if (!this.enabled || !this.transporter) {
      logger.warn('Email service not enabled, skipping email send');
      return false;
    }

    try {
      const mailOptions = {
        from: `"Developer Hub" <${this.fromEmail}>`,
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', {
        to,
        subject,
        messageId: info.messageId
      });
      return true;
    } catch (error) {
      logger.error('Failed to send email', error, { to, subject });
      return false;
    }
  }

  // Welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Developer Hub! 🎉';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Developer Hub!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We're thrilled to have you join our community of developers!</p>
            <p>Developer Hub is your new companion for learning and mastering programming technologies. Here's what you can do:</p>
            <ul>
              <li>🎯 Learn at your own pace with structured roadmaps</li>
              <li>📚 Access comprehensive learning materials</li>
              <li>💬 Connect with other developers</li>
              <li>🏆 Track your progress and earn badges</li>
            </ul>
            <a href="${process.env.APP_URL || 'http://localhost:4200'}/dashboard" class="button">Start Learning</a>
            <p>If you have any questions, don't hesitate to reach out to our support team.</p>
            <p>Happy coding!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:4200'}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { color: #dc3545; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p class="warning">This link will expire in 1 hour.</p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Email verification
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.APP_URL || 'http://localhost:4200'}/verify-email?token=${verificationToken}`;
    const subject = 'Verify Your Email Address';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Thanks for signing up for Developer Hub! Please verify your email address to get started.</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Learning reminder email
  async sendLearningReminder(user, streak) {
    const subject = streak >= 7 ? `🔥 ${streak} Day Streak! Keep it up!` : 'Keep Your Learning Streak Going!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .streak { font-size: 48px; font-weight: bold; color: #f5576c; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${streak >= 7 ? 'Amazing Progress!' : 'Don\'t Lose Your Streak!'}</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            ${streak >= 7 ? `
              <p>You're on fire! 🔥</p>
              <p class="streak">${streak} Days!</p>
              <p>You've maintained your learning streak for ${streak} consecutive days. That's incredible dedication!</p>
            ` : `
              <p>You have a <strong>${streak}-day learning streak</strong> going!</p>
              <p>Don't let it go to waste. Just 15 minutes of learning today will keep your streak alive.</p>
            `}
            <a href="${process.env.APP_URL || 'http://localhost:4200'}/dashboard" class="button">Continue Learning</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Achievement unlocked email
  async sendAchievementEmail(user, badge) {
    const subject = `🏆 Achievement Unlocked: ${badge.name}!`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .badge { font-size: 64px; margin: 20px 0; }
          .achievement { font-size: 24px; font-weight: bold; color: #f5576c; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 Achievement Unlocked!</h1>
          </div>
          <div class="content">
            <h2>Congratulations, ${user.firstName}!</h2>
            <div class="badge">${badge.icon || '🏆'}</div>
            <p class="achievement">${badge.name}</p>
            <p>${badge.description}</p>
            <p>You've earned <strong>${badge.points} points</strong> for this achievement!</p>
            <a href="${process.env.APP_URL || 'http://localhost:4200'}/achievements" class="button">View All Achievements</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Weekly progress report
  async sendWeeklyReport(user, stats) {
    const subject = 'Your Weekly Learning Report';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .stat-box { background: white; padding: 20px; border-radius: 10px; text-align: center; }
          .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
          .stat-label { color: #666; font-size: 14px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Weekly Learning Report</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Here's your learning progress for the past week:</p>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">${stats.lessonsCompleted || 0}</div>
                <div class="stat-label">Lessons Completed</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${stats.quizzesTaken || 0}</div>
                <div class="stat-label">Quizzes Taken</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${stats.learningTime || 0}m</div>
                <div class="stat-label">Learning Time</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${stats.streak || 0} 🔥</div>
                <div class="stat-label">Current Streak</div>
              </div>
            </div>
            <a href="${process.env.APP_URL || 'http://localhost:4200'}/dashboard" class="button">View Dashboard</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

// Export singleton instance
const emailService = new EmailService();

// Initialize on startup
emailService.initialize().catch(console.error);

module.exports = emailService;
