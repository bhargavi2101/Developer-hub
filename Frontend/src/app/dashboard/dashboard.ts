import { Component, OnInit } from '@angular/core';
import { RoadmapService } from '../roadmap-service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';

interface UserRoadmap {
  title: string;
  technologyId?: string;
  lastSubTechnologyId?: string;
  progress: number;
  completedLessons?: number;
  totalLessons?: number;
  color: string;
  _id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userName = '';
  userAvatar: string = '';
  userRank: string = 'Member';

  stats: { label: string; value: string; icon: string }[] = [
    { label: 'Active Paths', value: '0', icon: '🔥' },
    { label: 'Completed Lessons', value: '0', icon: '✅' },
    { label: 'Hub Points', value: '0', icon: '💎' }
  ];

  // Gamification properties
  learningStreak: number = 0;
  lastLearningDate: string = '';
  totalPoints: number = 0;
  earnedAchievements: number = 0;
  recentBadges: any[] = [];
  showAchievementNotification: boolean = false;
  newAchievements: string[] = [];

  myRoadmaps: UserRoadmap[] = [];

  isNewUser = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private roadmapService: RoadmapService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserRoadmaps();
    this.loadUserStatistics();
    this.loadRecentBadges();
  }

  loadRecentBadges() {
    this.roadmapService.getUserBadges().subscribe({
      next: (res: any) => {
        console.log('User badges loaded:', res);
        // Handle dynamic badge data
        this.recentBadges = (res || []).slice(0, 5); // Show last 5 badges

        // Check for newly unlocked badges (badges unlocked within last 24 hours)
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const newBadges = (res || []).filter((badge: any) => {
          return badge.unlockedAt && new Date(badge.unlockedAt) > yesterday;
        });

        if (newBadges.length > 0) {
          this.newAchievements = newBadges.map((badge: any) => badge.name);
          this.showAchievementNotification = true;

          // Auto-hide notification after 10 seconds
          setTimeout(() => {
            this.showAchievementNotification = false;
          }, 10000);
        }
      },
      error: (err) => {
        console.error('Error loading badges:', err);
        // Set empty array if badges fail to load
        this.recentBadges = [];
      }
    });
  }

  dismissAchievementNotification() {
    this.showAchievementNotification = false;
  }

  loadUserProfile() {
    this.roadmapService.getUserProfile().subscribe({
      next: (res: any) => {
        console.log('User profile loaded:', res);
        // Update user name with dynamic data
        this.userName = res.username || res.firstName || 'Developer';
        if (res.firstName && res.lastName) {
          this.userName = `${res.firstName} ${res.lastName}`;
        } else if (res.firstName) {
          this.userName = res.firstName;
        } else if (res.username) {
          this.userName = res.username;
        }

        // Update user avatar
        this.userAvatar = res.avatar || '';

        // Update user rank based on points
        const points = res.totalPoints || 0;
        if (points >= 10000) {
          this.userRank = 'Elite Member';
        } else if (points >= 5000) {
          this.userRank = 'Pro Member';
        } else if (points >= 1000) {
          this.userRank = 'Advanced Member';
        } else if (points >= 500) {
          this.userRank = 'Intermediate Member';
        } else {
          this.userRank = 'Member';
        }
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        // Set defaults if profile loading fails
        this.userName = 'Developer';
        this.userRank = 'Member';
      }
    });
  }

  navigateToBadges() {
    this.router.navigate(['/badges']);
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  loadUserStatistics() {
    this.roadmapService.getUserStatistics().subscribe({
      next: (res: any) => {
        console.log('User statistics loaded:', res);
        // Update stats with dynamic data
        this.stats = [
          { label: 'Active Paths', value: (res.activePaths || 0).toString(), icon: '🔥' },
          { label: 'Completed Lessons', value: (res.completedLessons || 0).toString(), icon: '✅' },
          { label: 'Hub Points', value: (res.totalPoints || 0).toString(), icon: '💎' }
        ];

        // Load gamification elements with dynamic data
        this.learningStreak = res.learningStreak || 0;
        this.lastLearningDate = res.lastLearningDate || '';
        this.totalPoints = res.totalPoints || 0;
        this.earnedAchievements = res.earnedAchievements || 0;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        // Set default values if statistics fail to load
        this.stats = [
          { label: 'Active Paths', value: '0', icon: '🔥' },
          { label: 'Completed Lessons', value: '0', icon: '✅' },
          { label: 'Hub Points', value: '0', icon: '💎' }
        ];
        this.learningStreak = 0;
        this.lastLearningDate = '';
        this.totalPoints = 0;
        this.earnedAchievements = 0;
      }
    });
  }

  loadUserRoadmaps() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.getUserRoadmaps().subscribe({
      next: (res: any) => {
        console.log('User roadmaps loaded:', res);
        // Load dynamic user roadmaps data
        this.myRoadmaps = (res || []).map((roadmap: any) => ({
          ...roadmap,
          color: roadmap.color || this.getRandomColor()
        }));
        this.isLoading = false;
        this.checkNewUser();
        this.loadUserStatistics(); // Reload statistics after roadmaps are loaded
      },
      error: (err) => {
        console.error('Error loading roadmaps:', err);
        this.errorMessage = this.errorHandler.showUserFriendlyError(err);
        this.myRoadmaps = []; // Empty array on error
        this.isLoading = false;
        this.checkNewUser();
      }
    });
  }

  // Helper method to generate random colors for roadmaps without colors
  getRandomColor(): string {
    const colors = ['#3b82f6', '#2dd4bf', '#a855f7', '#f59e0b', '#ef4444', '#10b981'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  checkNewUser() {
    this.isNewUser = !this.myRoadmaps || this.myRoadmaps.length === 0;

    if (this.isNewUser) {
      // For new users, show 0 stats or keep the ones loaded from API
      if (!this.stats || this.stats.length === 0) {
        this.stats = [
          { label: 'Active Paths', value: '0', icon: '🔥' },
          { label: 'Completed Lessons', value: '0', icon: '✅' },
          { label: 'Hub Points', value: '0', icon: '💎' }
        ];
      }
    }
  }

  goToRoadmaps() {
    this.router.navigate(['/roadmaps']);
  }

  navigateToRoadmaps() {
    // Check if user is authenticated before navigating
    const token = localStorage.getItem('token');

    if (token) {
      // User is authenticated, navigate to roadmaps
      this.router.navigate(['/roadmaps']);
    } else {
      // User is not authenticated, redirect to login with return URL
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/roadmaps' }
      });
    }
  }

  openRoadmap(roadmap: UserRoadmap) {
    // Navigate directly to the specific technology page for continuing learning
    if (roadmap.technologyId) {
      // If the user was working on a specific sub-technology, take them there
      if (roadmap.lastSubTechnologyId) {
        this.router.navigate(['/roadmaps', roadmap.technologyId, roadmap.lastSubTechnologyId]);
      } else {
        // Otherwise, take them to the main technology page
        this.router.navigate(['/roadmaps', roadmap.technologyId]);
      }
    } else {
      // Fallback: try to find by title if technologyId is missing
      this.router.navigate(['/roadmaps']);
    }
  }

  deleteRoadmap(roadmapId: string) {
    if (confirm('Are you sure you want to delete this roadmap?')) {
      this.roadmapService.deleteUserRoadmap(roadmapId).subscribe({
        next: () => {
          console.log('Roadmap deleted successfully');
          this.loadUserRoadmaps();
          alert('Roadmap deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting roadmap:', err);
          alert(this.errorHandler.showUserFriendlyError(err));
        }
      });
    }
  }

  updateProgress(roadmap: UserRoadmap, newProgress: number) {
    if (roadmap._id) {
      // Calculate completed lessons based on progress
      const completedLessons = Math.round((newProgress / 100) * (roadmap.totalLessons || 10));

      this.roadmapService.updateUserRoadmap(roadmap._id, {
        progress: newProgress,
        completedLessons
      }).subscribe({
        next: () => {
          console.log('Progress updated successfully');
          roadmap.progress = newProgress;
          roadmap.completedLessons = completedLessons;
        },
        error: (err) => {
          console.error('Error updating progress:', err);
          alert(this.errorHandler.showUserFriendlyError(err));
        }
      });
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 50) return '#3b82f6'; // blue
    if (progress >= 20) return '#f59e0b'; // orange
    return '#ef4444'; // red
  }
}