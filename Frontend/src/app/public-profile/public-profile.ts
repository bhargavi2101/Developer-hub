import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface PublicUserProfile {
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  interests?: string[];
  learningGoals?: string[];
}

interface UserRoadmap {
  _id?: string;
  title: string;
  technologyId?: string;
  progress: number;
  color: string;
}

@Component({
  selector: 'app-public-profile',
  standalone: false,
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css',
})
export class PublicProfile implements OnInit {
  username: string = '';
  userProfile: PublicUserProfile | null = null;
  userRoadmaps: UserRoadmap[] = [];
  isLoading = false;
  errorMessage = '';
  isFollowing = false;
  currentUser = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.username = params['username'];
      if (this.username) {
        this.loadPublicProfile();
      }
    });

    // Get current user for follow functionality
    this.currentUser = localStorage.getItem('username') || '';
  }

  loadPublicProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get(`http://localhost:3000/api/users/${this.username}`).subscribe({
      next: (res: any) => {
        console.log('Public profile loaded:', res);
        this.userProfile = res.user;
        this.userRoadmaps = res.roadmaps || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading public profile:', err);
        this.errorMessage = 'User not found or profile is private';
        this.isLoading = false;
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  }

  getProfileInitials(user: PublicUserProfile): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.username.substring(0, 2).toUpperCase();
  }

  goBack() {
    this.router.navigate(['/roadmaps']);
  }

  getGithubProfileUrl(github: string): string {
    return `https://github.com/${github}`;
  }

  getLinkedinProfileUrl(linkedin: string): string {
    return `https://linkedin.com/in/${linkedin}`;
  }

  navigateToRoadmap(roadmap: UserRoadmap) {
    if (roadmap.technologyId) {
      this.router.navigate(['/roadmaps', roadmap.technologyId]);
    }
  }

  // Social media icons (using unicode for simplicity)
  getGithubIcon(): string {
    return '🐙';
  }

  getLinkedinIcon(): string {
    return '💼';
  }

  getWebsiteIcon(): string {
    return '🌐';
  }

  getLocationIcon(): string {
    return '📍';
  }
}