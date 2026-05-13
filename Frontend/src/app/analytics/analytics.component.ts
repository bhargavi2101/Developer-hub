import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../roadmap-service';

interface LearningPattern {
  date: string;
  duration: number;
  sessions: number;
}

interface TechnologyStat {
  technology: {
    name: string;
    category: string;
  };
  duration: number;
  sessions: number;
}

interface Milestone {
  activityType: string;
  createdAt: string;
  description: string;
  metadata?: any;
}

interface UserStats {
  learning: {
    totalLessons: number;
    completedLessons: number;
    completionRate: string;
    learningTime: number;
    learningDays: number;
  };
  quizzes: {
    totalQuizzes: number;
    averageScore: number;
  };
  engagement: {
    notes: number;
    posts: number;
    forumPosts: number;
    totalEngagement: number;
  };
  achievements: {
    points: number;
    badges: number;
    rank: {
      position: number;
      title: string;
    };
  };
  streak: {
    currentStreak: number;
    lastLearningDate: string;
    longestStreak: number;
  };
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  totalPoints: number;
  learningStreak: number;
  completedLessons: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class Analytics implements OnInit {
  currentTab: 'patterns' | 'timeline' | 'statistics' | 'leaderboard' = 'patterns';
  selectedPeriod: '7d' | '30d' | '90d' = '30d';

  // Learning Patterns
  learningPatterns: LearningPattern[] = [];
  learningByTechnology: TechnologyStat[] = [];
  learningByHour: number[] = [];
  patternSummary: any = null;
  isLoadingPatterns = false;

  // Progress Timeline
  progressTimeline: any = null;
  roadmaps: any[] = [];
  milestones: Milestone[] = [];
  recentActivity: any[] = [];
  isLoadingTimeline = false;

  // Detailed Statistics
  userStats: UserStats | null = null;
  isLoadingStats = false;

  // Leaderboard
  leaderboard: LeaderboardEntry[] = [];
  leaderboardType: 'points' | 'streak' | 'lessons' = 'points';
  isLoadingLeaderboard = false;

  constructor(
    private roadmapService: RoadmapService
  ) {}

  ngOnInit() {
    this.loadLearningPatterns();
  }

  loadLearningPatterns() {
    this.isLoadingPatterns = true;
    this.roadmapService.getLearningPatterns(this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.learningPatterns = res.learningByDay;
        this.learningByTechnology = res.learningByTechnology;
        this.learningByHour = res.learningByHour;
        this.patternSummary = res.summary;
        this.isLoadingPatterns = false;
      },
      error: (err: any) => {
        console.error('Error loading learning patterns:', err);
        this.isLoadingPatterns = false;
      }
    });
  }

  loadProgressTimeline() {
    this.isLoadingTimeline = true;
    this.roadmapService.getProgressTimeline().subscribe({
      next: (res: any) => {
        this.progressTimeline = res;
        this.roadmaps = res.roadmaps;
        this.milestones = res.milestones;
        this.recentActivity = res.recentActivity;
        this.isLoadingTimeline = false;
      },
      error: (err: any) => {
        console.error('Error loading progress timeline:', err);
        this.isLoadingTimeline = false;
      }
    });
  }

  loadDetailedStatistics() {
    this.isLoadingStats = true;
    this.roadmapService.getDetailedStatistics().subscribe({
      next: (res: any) => {
        this.userStats = res;
        this.isLoadingStats = false;
      },
      error: (err: any) => {
        console.error('Error loading statistics:', err);
        this.isLoadingStats = false;
      }
    });
  }

  loadLeaderboard() {
    this.isLoadingLeaderboard = true;
    this.roadmapService.getLeaderboard(this.leaderboardType).subscribe({
      next: (res: any) => {
        this.leaderboard = res.leaderboard;
        this.isLoadingLeaderboard = false;
      },
      error: (err: any) => {
        console.error('Error loading leaderboard:', err);
        this.isLoadingLeaderboard = false;
      }
    });
  }

  setTab(tab: string) {
    this.currentTab = tab as any;

    switch (tab) {
      case 'patterns':
        this.loadLearningPatterns();
        break;
      case 'timeline':
        this.loadProgressTimeline();
        break;
      case 'statistics':
        this.loadDetailedStatistics();
        break;
      case 'leaderboard':
        this.loadLeaderboard();
        break;
    }
  }

  setPeriod(period: string) {
    this.selectedPeriod = period as any;
    this.loadLearningPatterns();
  }

  setLeaderboardType(type: string) {
    this.leaderboardType = type as any;
    this.loadLeaderboard();
  }

  formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      LOGIN: '🔐',
      LOGOUT: '🚪',
      LESSON_START: '📖',
      LESSON_COMPLETE: '✅',
      QUIZ_ATTEMPT: '❓',
      QUIZ_COMPLETE: '🎯',
      NOTE_CREATE: '📝',
      NOTE_UPDATE: '✏️',
      NOTE_DELETE: '🗑️',
      POST_CREATE: '💬',
      POST_LIKE: '❤️',
      COMMENT_CREATE: '💭',
      FORUM_CREATE: '📚',
      FORUM_REPLY: '💬',
      FOLLOW_USER: '👥',
      EARN_BADGE: '🏆',
      STREAK_MILESTONE: '🔥'
    };
    return icons[type] || '📋';
  }

  getLearningStreakColor(streak: number): string {
    if (streak >= 30) return '#10b981';
    if (streak >= 14) return '#f59e0b';
    if (streak >= 7) return '#3b82f6';
    return '#6b7280';
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Web Development': '#3b82f6',
      'Mobile Development': '#8b5cf6',
      'Data Science': '#10b981',
      'DevOps': '#f59e0b',
      'Cloud Computing': '#ef4444',
      'Machine Learning': '#ec4899',
      'Cybersecurity': '#6366f1'
    };
    return colors[category] || '#6b7280';
  }
}
