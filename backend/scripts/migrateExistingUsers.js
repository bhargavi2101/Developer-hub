/**
 * Database Migration Script for Existing Users
 *
 * This script migrates existing users to have default values for new fields
 * that were added in Phase 1 and subsequent phases.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Migration function
async function migrateExistingUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const User = require('../models/User');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      let needsUpdate = false;

      // Add default values for new fields from Phase 1
      if (!user.location) {
        user.location = '';
        needsUpdate = true;
      }

      if (!user.website) {
        user.website = '';
        needsUpdate = true;
      }

      if (!user.github) {
        user.github = '';
        needsUpdate = true;
      }

      if (!user.linkedin) {
        user.linkedin = '';
        needsUpdate = true;
      }

      if (!user.skills || !Array.isArray(user.skills)) {
        user.skills = [];
        needsUpdate = true;
      }

      if (!user.interests || !Array.isArray(user.interests)) {
        user.interests = [];
        needsUpdate = true;
      }

      if (!user.learningGoals || !Array.isArray(user.learningGoals)) {
        user.learningGoals = [];
        needsUpdate = true;
      }

      // Add default values for social features from Phase 4
      if (!user.social) {
        user.social = {
          allowFollowers: true,
          showProfile: true,
          showProgress: true
        };
        needsUpdate = true;
      } else {
        if (user.social.allowFollowers === undefined) {
          user.social.allowFollowers = true;
          needsUpdate = true;
        }
        if (user.social.showProfile === undefined) {
          user.social.showProfile = true;
          needsUpdate = true;
        }
        if (user.social.showProgress === undefined) {
          user.social.showProgress = true;
          needsUpdate = true;
        }
      }

      // Add default values for analytics from Phase 5
      if (user.totalPoints === undefined) {
        user.totalPoints = 0;
        needsUpdate = true;
      }

      if (user.learningStreak === undefined) {
        user.learningStreak = 0;
        needsUpdate = true;
      }

      if (user.longestStreak === undefined) {
        user.longestStreak = 0;
        needsUpdate = true;
      }

      if (user.lastLearningDate === undefined) {
        user.lastLearningDate = null;
        needsUpdate = true;
      }

      // Add default values for preferences
      if (!user.preferences) {
        user.preferences = {
          theme: 'dark',
          notifications: true,
          emailUpdates: true,
          language: 'en'
        };
        needsUpdate = true;
      }

      // Save user if updates were needed
      if (needsUpdate) {
        await user.save();
        migratedCount++;
        console.log(`✅ Migrated user: ${user.username}`);
      } else {
        skippedCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`- Total users: ${users.length}`);
    console.log(`- Migrated: ${migratedCount}`);
    console.log(`- Skipped: ${skippedCount}`);
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run migration
migrateExistingUsers();