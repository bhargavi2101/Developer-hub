require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

console.log("MONGO URI:", process.env.MONGO_URI);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
