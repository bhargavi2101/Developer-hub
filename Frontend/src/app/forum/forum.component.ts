import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../roadmap-service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth-service';

interface ForumTopic {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  viewCount: number;
  lastReplyAt: string;
  createdAt: string;
  createdBy: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  technologyId: string;
  subTechnologyId?: string;
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit {
  forums: ForumTopic[] = [];
  isLoading = false;
  errorMessage = '';
  selectedCategory = 'all';
  searchQuery = '';
  technologyId: string = '';
  subTechnologyId: string = '';
  showCreateDialog = false;

  newForum = {
    title: '',
    description: '',
    category: 'discussion',
    tags: [] as string[],
    isPinned: false
  };

  categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'question', label: 'Question' },
    { value: 'help', label: 'Help Needed' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'resource', label: 'Resource' }
  ];

  constructor(
    private roadmapService: RoadmapService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.technologyId = params['technologyId'] || '';
      this.subTechnologyId = params['subTechnologyId'] || '';
      this.loadForums();
    });
  }

  loadForums() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.technologyId) {
      this.roadmapService.getTechnologyForums(this.technologyId).subscribe({
        next: (res: any) => {
          this.forums = res;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading forums:', err);
          this.errorMessage = 'Failed to load forums';
          this.isLoading = false;
        }
      });
    } else {
      this.searchForums('');
    }
  }

  searchForums(query: string) {
    if (!query && this.technologyId) {
      this.loadForums();
      return;
    }

    this.isLoading = true;

    if (query) {
      this.roadmapService.searchForums(query).subscribe({
        next: (res: any) => {
          this.forums = res.forums || [];
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error searching forums:', err);
          this.errorMessage = 'Failed to search forums';
          this.isLoading = false;
        }
      });
    }
  }

  createForum() {
    if (!this.newForum.title.trim()) {
      alert('Forum title is required');
      return;
    }

    const forumData = {
      ...this.newForum,
      technologyId: this.technologyId,
      subTechnologyId: this.subTechnologyId,
      title: this.newForum.title.trim(),
      description: this.newForum.description.trim()
    };

    this.roadmapService.createForum(forumData).subscribe({
      next: (res: any) => {
        this.forums.unshift(res);
        this.toggleCreateDialog();
        this.newForum = {
          title: '',
          description: '',
          category: 'discussion',
          tags: [],
          isPinned: false
        };
      },
      error: (err: any) => {
        console.error('Error creating forum:', err);
        alert('Failed to create forum');
      }
    });
  }

  toggleCreateDialog() {
    this.showCreateDialog = !this.showCreateDialog;
  }

  goToForumTopic(forumId: string) {
    this.router.navigate(['/forum-topic', forumId]);
  }

  goToUserProfile(username: string) {
    this.router.navigate(['/profile', username]);
  }

  addTag(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim();
    if (tag && !this.newForum.tags.includes(tag) && keyboardEvent.key === 'Enter') {
      this.newForum.tags.push(tag);
      input.value = '';
    }
  }

  removeTag(index: number) {
    this.newForum.tags.splice(index, 1);
  }

  getFilteredForums(): ForumTopic[] {
    let filtered = [...this.forums];

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastReplyAt || b.createdAt).getTime() - new Date(a.lastReplyAt || a.createdAt).getTime();
    });
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      discussion: '#3b82f6',
      question: '#f59e0b',
      help: '#ef4444',
      showcase: '#10b981',
      resource: '#8b5cf6'
    };
    return colors[category] || '#6b7280';
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
}
