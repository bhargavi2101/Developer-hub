require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Basic middleware
app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.send('Debug server running');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works' });
});

// Try to load and mount routes one by one
try {
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('User routes loaded successfully');
} catch (error) {
  console.error('Error loading user routes:', error.message);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

console.log("MONGO URI:", process.env.MONGO_URI);

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
});
