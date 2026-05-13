import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../roadmap-service';
import { Router, ActivatedRoute } from '@angular/router';

interface SocialPost {
  _id: string;
  userId: string;
  content: string;
  type: string;
  visibility: string;
  likes: string[];
  comments: any[];
  shares: number;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  user?: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  isLiked: boolean;
}

@Component({
  selector: 'app-social-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './social-feed.html',
  styleUrl: './social-feed.css',
})
export class SocialFeed implements OnInit {
  posts: SocialPost[] = [];
  isLoading = false;
  errorMessage = '';
  currentUser = '';
  newPostContent = '';
  selectedTab: 'feed' | 'following' | 'my-posts' = 'feed';

  // Post creation state
  showPostDialog = false;
  postType: 'text' = 'text';
  postTags: string[] = [];
  postVisibility: 'public' = 'public';

  constructor(
    private roadmapService: RoadmapService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadSocialFeed();
    this.currentUser = localStorage.getItem('username') || '';
  }

  loadSocialFeed() {
    this.isLoading = true;
    this.errorMessage = '';

    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoading = false;
      this.errorMessage = 'Please login to see social features';
      return;
    }

    this.roadmapService.getUserFeed().subscribe({
      next: (res: any) => {
        console.log('Social feed loaded:', res);
        this.posts = res.map((post: any) => ({
          ...post,
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          isLiked: post.likes?.includes(this.getCurrentUserId())
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading social feed:', err);
        this.errorMessage = 'Failed to load social feed';
        this.isLoading = false;
      }
    });
  }

  loadFollowingFeed() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.getFollowingFeed().subscribe({
      next: (res: any) => {
        console.log('Following feed loaded:', res);
        this.posts = res.map((post: any) => ({
          ...post,
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          isLiked: post.likes?.includes(this.getCurrentUserId())
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading following feed:', err);
        this.errorMessage = 'Failed to load following feed';
        this.isLoading = false;
      }
    });
  }

  loadMyPosts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.getUserFeed({ visibility: 'private' }).subscribe({
      next: (res: any) => {
        console.log('My posts loaded:', res);
        this.posts = res.map((post: any) => ({
          ...post,
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          isLiked: post.likes?.includes(this.getCurrentUserId())
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading my posts:', err);
        this.errorMessage = 'Failed to load my posts';
        this.isLoading = false;
      }
    });
  }

  getCurrentUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  togglePostDialog() {
    this.showPostDialog = !this.showPostDialog;
    if (!this.showPostDialog) {
      this.newPostContent = '';
      this.postTags = [];
    }
  }

  createPost() {
    if (!this.newPostContent.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    const postData = {
      content: this.newPostContent.trim(),
      type: this.postType,
      visibility: this.postVisibility,
      tags: this.postTags
    };

    this.roadmapService.createPost(postData).subscribe({
      next: (res: any) => {
        console.log('Post created:', res);
        this.posts.unshift({
          ...res,
          likesCount: 0,
          commentsCount: 0,
          isLiked: false
        });
        this.togglePostDialog();
        this.loadSocialFeed();
      },
      error: (err: any) => {
        console.error('Error creating post:', err);
        alert('Failed to create post');
      }
    });
  }

  likePost(post: SocialPost) {
    this.roadmapService.likePost(post._id).subscribe({
      next: (res: any) => {
        console.log('Post liked:', res);
        post.isLiked = res.liked;
        post.likesCount = res.likeCount;
      },
      error: (err: any) => {
        console.error('Error liking post:', err);
      }
    });
  }

  getFilteredPosts(): SocialPost[] {
    switch (this.selectedTab) {
      case 'feed':
        return this.posts;
      case 'following':
        return this.posts.filter(p => p.user?.username !== this.currentUser);
      case 'my-posts':
        return this.posts.filter(p => p.user?.username === this.currentUser);
      default:
        return this.posts;
    }
  }

  setTab(tab: string) {
    this.selectedTab = tab as 'feed' | 'following' | 'my-posts';

    switch (tab) {
      case 'feed':
        this.loadSocialFeed();
        break;
      case 'following':
        this.loadFollowingFeed();
        break;
      case 'my-posts':
        this.loadMyPosts();
        break;
    }
  }

  goToUserProfile(username: string) {
    this.router.navigate(['/profile', username]);
  }

  formatPostTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  }

  addTag(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim();
    if (tag && !this.postTags.includes(tag) && event.key === 'Enter') {
      this.postTags.push(tag);
      input.value = '';
    }
  }

  removeTag(index: number) {
    this.postTags.splice(index, 1);
  }

  setPostType(type: string) {
    this.postType = type as 'text';
  }

  setVisibility(visibility: string) {
    this.postVisibility = visibility as 'public';
  }
}