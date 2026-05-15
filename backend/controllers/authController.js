const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Generate JWT Token with stronger secret
const generateToken = (id) => {
  // Use a more secure JWT secret from environment or generate one
  const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
  return jwt.sign(
    { id, iat: Math.floor(Date.now() / 1000) },
    secret,
    {
      expiresIn: '1h', // Shorter expiration for security
      algorithm: 'HS256'
    }
  );
};

// Generate refresh token
const generateRefreshToken = (id) => {
  const secret = process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex');
  return jwt.sign(
    { id, type: 'refresh' },
    secret,
    {
      expiresIn: '7d',
      algorithm: 'HS256'
    }
  );
};

// Register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input sanitization
    const sanitizedUsername = username.trim().substring(0, 30);
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
      return res.status(400).json({ msg: 'Username can only contain letters, numbers, and underscores' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email: sanitizedEmail },
        { username: sanitizedUsername }
      ]
    });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email or username' });
    }

    // Hash password with stronger salt rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const user = new User({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword
    });
    await user.save();

    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input sanitization
    const sanitizedEmail = email.trim().toLowerCase();

    // Find user by email and check if banned
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        msg: 'Account has been banned',
        reason: user.banReason || 'No reason provided'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      msg: 'Login successful',
      token,
      refreshToken,
      expiresIn: '1h',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

module.exports = { register, login };
