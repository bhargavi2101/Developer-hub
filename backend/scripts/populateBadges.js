require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../models/Badge');
const sampleBadges = require('../data/sampleBadges');

async function populateBadges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing badges (optional - comment out if you want to keep existing)
    await Badge.deleteMany({});
    console.log('🗑️  Cleared existing badges');

    // Insert sample badges
    const insertedBadges = await Badge.insertMany(sampleBadges);
    console.log(`✅ Successfully inserted ${insertedBadges.length} badges`);

    // Display inserted badges
    console.log('\n📋 Inserted Badges:');
    insertedBadges.forEach(badge => {
      console.log(`  • ${badge.name} (${badge.rarity}) - ${badge.points} points`);
    });

  } catch (error) {
    console.error('❌ Error populating badges:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the populate function
populateBadges();