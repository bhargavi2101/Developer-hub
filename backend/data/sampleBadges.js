// Sample badges data for the Developer Hub platform

const sampleBadges = [
  // Learning Milestones
  {
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'learning',
    rarity: 'common',
    points: 50,
    criteria: {
      type: 'first_lesson',
      value: 1
    }
  },
  {
    name: 'Knowledge Seeker',
    description: 'Complete 10 lessons',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    points: 150,
    criteria: {
      type: 'lessons_completed',
      value: 10
    }
  },
  {
    name: 'Dedicated Learner',
    description: 'Complete 50 lessons',
    icon: '🎓',
    category: 'learning',
    rarity: 'rare',
    points: 500,
    criteria: {
      type: 'lessons_completed',
      value: 50
    }
  },
  {
    name: 'Master of Knowledge',
    description: 'Complete 100 lessons',
    icon: '👑',
    category: 'learning',
    rarity: 'epic',
    points: 1500,
    criteria: {
      type: 'lessons_completed',
      value: 100
    }
  },

  // Roadmap Achievements
  {
    name: 'Pathfinder',
    description: 'Complete your first roadmap',
    icon: '🗺️',
    category: 'learning',
    rarity: 'common',
    points: 200,
    criteria: {
      type: 'roadmaps_completed',
      value: 1
    }
  },
  {
    name: 'Multi-disciplined',
    description: 'Complete 3 different roadmaps',
    icon: '🌟',
    category: 'learning',
    rarity: 'rare',
    points: 800,
    criteria: {
      type: 'roadmaps_completed',
      value: 3
    }
  },
  {
    name: 'Polyglot Developer',
    description: 'Complete 5 different roadmaps',
    icon: '🚀',
    category: 'learning',
    rarity: 'epic',
    points: 2000,
    criteria: {
      type: 'roadmaps_completed',
      value: 5
    }
  },

  // Streak Achievements
  {
    name: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    category: 'engagement',
    rarity: 'common',
    points: 100,
    criteria: {
      type: 'streak_days',
      value: 7
    }
  },
  {
    name: 'Dedicated Student',
    description: 'Maintain a 30-day learning streak',
    icon: '💪',
    category: 'engagement',
    rarity: 'rare',
    points: 500,
    criteria: {
      type: 'streak_days',
      value: 30
    }
  },
  {
    name: 'Unstoppable',
    description: 'Maintain a 90-day learning streak',
    icon: '⚡',
    category: 'engagement',
    rarity: 'epic',
    points: 2000,
    criteria: {
      type: 'streak_days',
      value: 90
    }
  },
  {
    name: 'Legendary Streak',
    description: 'Maintain a 365-day learning streak',
    icon: '🏆',
    category: 'engagement',
    rarity: 'legendary',
    points: 10000,
    criteria: {
      type: 'streak_days',
      value: 365
    }
  },

  // Points Achievements
  {
    name: 'Rising Star',
    description: 'Earn 1,000 Hub Points',
    icon: '⭐',
    category: 'achievement',
    rarity: 'common',
    points: 200,
    criteria: {
      type: 'total_points',
      value: 1000
    }
  },
  {
    name: 'Points Collector',
    description: 'Earn 5,000 Hub Points',
    icon: '🌟',
    category: 'achievement',
    rarity: 'rare',
    points: 1000,
    criteria: {
      type: 'total_points',
      value: 5000
    }
  },
  {
    name: 'Points Master',
    description: 'Earn 25,000 Hub Points',
    icon: '💎',
    category: 'achievement',
    rarity: 'epic',
    points: 5000,
    criteria: {
      type: 'total_points',
      value: 25000
    }
  },

  // Special Achievements
  {
    name: 'Early Adopter',
    description: 'Join in the first month of platform launch',
    icon: '🎮',
    category: 'special',
    rarity: 'legendary',
    points: 3000,
    criteria: {
      type: 'all_completed',
      value: 'early_adopter'
    }
  },
  {
    name: 'Complete All',
    description: 'Complete all available roadmaps',
    icon: '🏅',
    category: 'special',
    rarity: 'legendary',
    points: 5000,
    criteria: {
      type: 'all_completed',
      value: 'all_roadmaps'
    }
  },
  {
    name: 'Speed Demon',
    description: 'Complete a roadmap in under 24 hours',
    icon: '⚡',
    category: 'special',
    rarity: 'rare',
    points: 300,
    criteria: {
      type: 'all_completed',
      value: 'speed_demon'
    }
  },
  {
    name: 'Night Owl',
    description: 'Complete a lesson between 2 AM - 4 AM',
    icon: '🦉',
    category: 'special',
    rarity: 'common',
    points: 100,
    criteria: {
      type: 'all_completed',
      value: 'night_owl'
    }
  }
];

module.exports = sampleBadges;