const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@developerhub.com';
    this.isConfigured = false;
  }

  // Initialize email service
  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.warn('Email service not configured (this is optional)');
          this.isConfigured = false;
        } else {
          console.log('Email service is ready');
          this.isConfigured = true;
        }
      });
    } catch (error) {
      console.warn('Failed to initialize email service (this is optional):', error.message);
      this.isConfigured = false;
    }
  }

  // Send email notification
  async sendEmail(to, subject, html, text) {
    if (!this.isConfigured) {
      console.warn('Email service not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
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
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send notification email
  async sendNotificationEmail(userEmail, userName, title, message, actionUrl) {
    const html = this.generateNotificationEmail(userName, title, message, actionUrl);
    const text = `${title}\n\n${message}\n\nView: ${actionUrl}`;

    return this.sendEmail(userEmail, title, html, text);
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail, userName) {
    const html = this.generateWelcomeEmail(userName);
    const text = `Welcome to Developer Hub, ${userName}!`;

    return this.sendEmail(userEmail, 'Welcome to Developer Hub!', html, text);
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = this.generatePasswordResetEmail(userName, resetUrl);
    const text = `Click here to reset your password: ${resetUrl}`;

    return this.sendEmail(userEmail, 'Password Reset Request', html, text);
  }

  // Send achievement email
  async sendAchievementEmail(userEmail, userName, badgeName, badgeIcon) {
    const html = this.generateAchievementEmail(userName, badgeName, badgeIcon);
    const text = `Congratulations ${userName}! You earned the ${badgeName} badge!`;

    return this.sendEmail(userEmail, '🏆 Achievement Unlocked!', html, text);
  }

  // Generate HTML for notification email
  generateNotificationEmail(userName, title, message, actionUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Developer Hub Notification</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .content { padding: 30px; }
          .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
          .title { font-size: 24px; color: #667eea; margin-bottom: 15px; }
          .message { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 25px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .button:hover { background: #5568d3; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 DevHub</div>
          </div>
          <div class="content">
            <div class="greeting">Hi ${userName},</div>
            <h2 class="title">${title}</h2>
            <p class="message">${message}</p>
            <a href="${actionUrl}" class="button">View Notification</a>
          </div>
          <div class="footer">
            <p>© 2026 Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate HTML for welcome email
  generateWelcomeEmail(userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Developer Hub</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
          .logo { font-size: 36px; font-weight: bold; margin-bottom: 15px; }
          .welcome-text { font-size: 18px; }
          .content { padding: 40px 30px; }
          .title { font-size: 28px; color: #667eea; margin-bottom: 20px; text-align: center; }
          .message { font-size: 16px; color: #666; line-height: 1.8; margin-bottom: 30px; }
          .features { display: flex; gap: 20px; margin: 30px 0; }
          .feature { flex: 1; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
          .feature-icon { font-size: 40px; margin-bottom: 15px; }
          .feature-title { font-weight: bold; color: #333; margin-bottom: 5px; }
          .button { display: inline-block; padding: 18px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .button:hover { background: #5568d3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 DevHub</div>
            <p class="welcome-text">Welcome to the community!</p>
          </div>
          <div class="content">
            <h1 class="title">Hi ${userName}!</h1>
            <p class="message">Thank you for joining Developer Hub! We're excited to have you as part of our learning community.</p>
            <div class="features">
              <div class="feature">
                <div class="feature-icon">📚</div>
                <div class="feature-title">Learn</div>
                <div>Structured roadmaps</div>
              </div>
              <div class="feature">
                <div class="feature-icon">🏆</div>
                <div class="feature-title">Achieve</div>
                <div>Earn badges & points</div>
              </div>
              <div class="feature">
                <div class="feature-icon">🤝</div>
                <div class="feature-title">Connect</div>
                <div>Join community</div>
              </div>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/dashboard" class="button">Start Learning</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate HTML for password reset email
  generatePasswordResetEmail(userName, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Developer Hub</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .logo { font-size: 32px; font-weight: bold; }
          .content { padding: 30px; }
          .title { font-size: 24px; color: #667eea; margin-bottom: 15px; text-align: center; }
          .message { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 25px; text-align: center; }
          .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .button:hover { background: #5568d3; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; font-size: 14px; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 DevHub</div>
          </div>
          <div class="content">
            <h2 class="title">Password Reset Request</h2>
            <p class="message">Hi ${userName},<br><br>We received a request to reset your password. Click the button below to reset it.</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate HTML for achievement email
  generateAchievementEmail(userName, badgeName, badgeIcon) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Achievement Unlocked - Developer Hub</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
          .badge-icon { font-size: 80px; margin-bottom: 15px; }
          .content { padding: 40px 30px; text-align: center; }
          .congrats { font-size: 28px; color: #667eea; margin-bottom: 10px; }
          .badge-name { font-size: 22px; color: #333; margin: 25px 0 15px 0; font-weight: bold; }
          .message { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 30px; }
          .button { display: inline-block; padding: 18px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .button:hover { background: #5568d3; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge-icon">${badgeIcon}</div>
          </div>
          <div class="content">
            <h1 class="congrats">🎉 Achievement Unlocked!</h1>
            <h2 class="badge-name">${badgeName}</h2>
            <p class="message">Congratulations ${userName}! You've earned this badge for your dedication and progress on Developer Hub.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/badges" class="button">View Badge</a>
          </div>
          <div class="footer">
            <p>© 2026 Developer Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();