require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorMiddleware');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS middleware - restrict to specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://developerhub.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login/register attempts per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with security headers
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Health check route (must be before API routes)
app.get('/', (req, res) => {
  res.send('API running');
});

// API Routes with error handling
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
}

try {
  const userRoadmapRoutes = require('./routes/userRoadmapRoutes');
  app.use('/api/user-roadmaps', userRoadmapRoutes);
  console.log('✅ User roadmap routes loaded');
} catch (error) {
  console.error('❌ Error loading user roadmap routes:', error.message);
}

try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
}

try {
  const uploadRoutes = require('./routes/uploadRoutes');
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Upload routes loaded');
} catch (error) {
  console.error('❌ Error loading upload routes:', error.message);
}

try {
  const badgeRoutes = require('./routes/badgeRoutes');
  app.use('/api/badges', badgeRoutes);
  console.log('✅ Badge routes loaded');
} catch (error) {
  console.error('❌ Error loading badge routes:', error.message);
}

try {
  const noteRoutes = require('./routes/noteRoutes');
  app.use('/api/notes', noteRoutes);
  console.log('✅ Note routes loaded');
} catch (error) {
  console.error('❌ Error loading note routes:', error.message);
}

try {
  const quizRoutes = require('./routes/quizRoutes');
  app.use('/api/quizzes', quizRoutes);
  console.log('✅ Quiz routes loaded');
} catch (error) {
  console.error('❌ Error loading quiz routes:', error.message);
}

try {
  const timeTrackingRoutes = require('./routes/timeTrackingRoutes');
  app.use('/api/time-tracking', timeTrackingRoutes);
  console.log('✅ Time tracking routes loaded');
} catch (error) {
  console.error('❌ Error loading time tracking routes:', error.message);
}

try {
  const socialRoutes = require('./routes/socialRoutes');
  app.use('/api/social', socialRoutes);
  console.log('✅ Social routes loaded');
} catch (error) {
  console.error('❌ Error loading social routes:', error.message);
}

try {
  const forumRoutes = require('./routes/forumRoutes');
  app.use('/api/forums', forumRoutes);
  console.log('✅ Forum routes loaded');
} catch (error) {
  console.error('❌ Error loading forum routes:', error.message);
}

try {
  const adminRoutes = require('./routes/adminRoutes');
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.error('❌ Error loading admin routes:', error.message);
}

try {
  const contentRoutes = require('./routes/contentRoutes');
  app.use('/api/content', contentRoutes);
  console.log('✅ Content routes loaded');
} catch (error) {
  console.error('❌ Error loading content routes:', error.message);
}

try {
  const analyticsRoutes = require('./routes/analyticsRoutes');
  app.use('/api/analytics', analyticsRoutes);
  console.log('✅ Analytics routes loaded');
} catch (error) {
  console.error('❌ Error loading analytics routes:', error.message);
}

try {
  const searchRoutes = require('./routes/searchRoutes');
  app.use('/api/search', searchRoutes);
  console.log('✅ Search routes loaded');
} catch (error) {
  console.error('❌ Error loading search routes:', error.message);
}

try {
  const notificationRoutes = require('./routes/notificationRoutes');
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ Notification routes loaded');
} catch (error) {
  console.error('❌ Error loading notification routes:', error.message);
}

try {
  const performanceRoutes = require('./routes/performanceRoutes');
  app.use('/api/performance', performanceRoutes);
  console.log('✅ Performance routes loaded');
} catch (error) {
  console.error('❌ Error loading performance routes:', error.message);
}

// Protected route for testing
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    msg: 'You accessed protected route',
    user: req.user
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Security headers enabled`);
  console.log(`📊 Rate limiting active`);
});
