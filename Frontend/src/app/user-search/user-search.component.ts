import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../roadmap-service';
import { Router } from '@angular/router';

interface UserProfile {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  skills: string[];
  interests: string[];
  learningGoals: string[];
  learningStreak: number;
  totalPoints: number;
  completedRoadmaps: number;
  completedLessons: number;
  followers: string[];
  following: string[];
  shareProgress: boolean;
  allowFollowers: boolean;
  isFollowing: boolean;
  stats?: {
    totalRoadmaps: number;
    completedRoadmaps: number;
    totalLessons: number;
    completedLessons: number;
    learningStreak: number;
    totalPoints: number;
  };
}

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearch implements OnInit {
  searchQuery = '';
  users: UserProfile[] = [];
  isLoading = false;
  errorMessage = '';
  currentUserId = '';

  filters = {
    skills: '',
    location: '',
    hasCompletedRoadmaps: false
  };

  constructor(
    private roadmapService: RoadmapService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId') || '';
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.searchUsers(this.searchQuery).subscribe({
      next: (res: any) => {
        this.users = res.map((user: UserProfile) => ({
          ...user,
          isFollowing: user.followers?.includes(this.currentUserId) || false
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  searchUsers() {
    if (this.searchQuery.trim().length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }
    this.loadUsers();
  }

  followUser(userId: string) {
    this.roadmapService.followUser(userId).subscribe({
      next: (res: any) => {
        const user = this.users.find(u => u._id === userId);
        if (user) {
          user.isFollowing = true;
          user.followers?.push(this.currentUserId);
        }
      },
      error: (err: any) => {
        console.error('Error following user:', err);
        alert('Failed to follow user');
      }
    });
  }

  unfollowUser(userId: string) {
    this.roadmapService.unfollowUser(userId).subscribe({
      next: (res: any) => {
        const user = this.users.find(u => u._id === userId);
        if (user) {
          user.isFollowing = false;
          user.followers = user.followers?.filter(id => id !== this.currentUserId) || [];
        }
      },
      error: (err: any) => {
        console.error('Error unfollowing user:', err);
        alert('Failed to unfollow user');
      }
    });
  }

  goToUserProfile(username: string) {
    this.router.navigate(['/profile', username]);
  }

  getFilteredUsers(): UserProfile[] {
    let filtered = [...this.users];

    if (this.filters.skills) {
      const skill = this.filters.skills.toLowerCase();
      filtered = filtered.filter(user =>
        user.skills.some(s => s.toLowerCase().includes(skill))
      );
    }

    if (this.filters.location) {
      const location = this.filters.location.toLowerCase();
      filtered = filtered.filter(user =>
        user.location?.toLowerCase().includes(location)
      );
    }

    if (this.filters.hasCompletedRoadmaps) {
      filtered = filtered.filter(user =>
        user.completedRoadmaps > 0
      );
    }

    return filtered;
  }

  clearFilters() {
    this.filters = {
      skills: '',
      location: '',
      hasCompletedRoadmaps: false
    };
  }

  getLearningStreakColor(streak: number): string {
    if (streak >= 30) return '#10b981';
    if (streak >= 14) return '#f59e0b';
    if (streak >= 7) return '#3b82f6';
    return '#6b7280';
  }
}
