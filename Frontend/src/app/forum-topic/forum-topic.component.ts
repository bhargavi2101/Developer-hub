import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../roadmap-service';
import { Router, ActivatedRoute } from '@angular/router';

interface ForumReply {
  _id: string;
  forumId: string;
  userId: string;
  content: string;
  parentReplyId: string | null;
  depth: number;
  likes: string[];
  isLiked: boolean;
  likesCount: number;
  isAcceptedAnswer: boolean;
  isEdited: boolean;
  editedAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

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
  selector: 'app-forum-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum-topic.component.html',
  styleUrl: './forum-topic.component.css'
})
export class ForumTopicComponent implements OnInit {
  forum: ForumTopic | null = null;
  replies: ForumReply[] = [];
  replyThreads: ForumReply[][] = [];
  totalReplies = 0;
  isLoading = false;
  errorMessage = '';
  currentUserId = '';

  newReplyContent = '';
  parentReplyId: string | null = null;
  replyDepth = 0;

  showReplyForm = false;
  replyingTo: ForumReply | null = null;

  constructor(
    private roadmapService: RoadmapService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId') || '';
    this.route.params.subscribe(params => {
      const forumId = params['forumId'];
      if (forumId) {
        this.loadForumTopic(forumId);
      }
    });
  }

  loadForumTopic(forumId: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.getForumWithReplies(forumId).subscribe({
      next: (res: any) => {
        this.forum = res.forum;
        this.replies = res.topLevelReplies || [];
        this.replyThreads = res.replyThreads || [];
        this.totalReplies = res.totalReplies || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading forum topic:', err);
        this.errorMessage = 'Failed to load forum topic';
        this.isLoading = false;
      }
    });
  }

  submitReply() {
    if (!this.newReplyContent.trim()) {
      alert('Reply content cannot be empty');
      return;
    }

    if (this.forum?.isLocked) {
      alert('This discussion is locked');
      return;
    }

    const replyData = {
      content: this.newReplyContent.trim(),
      parentReplyId: this.parentReplyId
    };

    this.roadmapService.addReply(this.forum!._id, replyData).subscribe({
      next: (res: any) => {
        this.loadForumTopic(this.forum!._id);
        this.resetReplyForm();
      },
      error: (err) => {
        console.error('Error adding reply:', err);
        alert('Failed to add reply');
      }
    });
  }

  likeReply(reply: ForumReply) {
    this.roadmapService.likeReply(reply._id).subscribe({
      next: (res: any) => {
        reply.isLiked = res.liked;
        reply.likesCount = res.likeCount;
      },
      error: (err) => {
        console.error('Error liking reply:', err);
      }
    });
  }

  acceptAnswer(reply: ForumReply) {
    if (!this.forum) return;

    if (this.forum.createdBy.username !== localStorage.getItem('username')) {
      alert('Only the original poster can accept answers');
      return;
    }

    this.roadmapService.acceptAnswer(reply._id).subscribe({
      next: (res: any) => {
        this.loadForumTopic(this.forum!._id);
      },
      error: (err) => {
        console.error('Error accepting answer:', err);
        alert('Failed to accept answer');
      }
    });
  }

  togglePin(forumId: string) {
    this.roadmapService.togglePinForum(forumId).subscribe({
      next: (res: any) => {
        this.forum = { ...this.forum!, isPinned: res.isPinned };
      },
      error: (err) => {
        console.error('Error toggling pin:', err);
        alert('Failed to toggle pin');
      }
    });
  }

  toggleLock(forumId: string) {
    this.roadmapService.toggleLockForum(forumId).subscribe({
      next: (res: any) => {
        this.forum = { ...this.forum!, isLocked: res.isLocked };
      },
      error: (err) => {
        console.error('Error toggling lock:', err);
        alert('Failed to toggle lock');
      }
    });
  }

  showReplyFormFor(reply: ForumReply) {
    this.showReplyForm = true;
    this.replyingTo = reply;
    this.parentReplyId = reply._id;
    this.replyDepth = reply.depth + 1;

    if (this.replyDepth > 5) {
      alert('Maximum reply depth exceeded');
      this.resetReplyForm();
    }
  }

  resetReplyForm() {
    this.showReplyForm = false;
    this.replyingTo = null;
    this.parentReplyId = null;
    this.replyDepth = 0;
    this.newReplyContent = '';
  }

  goToUserProfile(username: string) {
    this.router.navigate(['/profile', username]);
  }

  goBack() {
    this.router.navigate(['/forum']);
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

  getRepliesForThread(parentReply: ForumReply): ForumReply[] {
    return this.replyThreads.find(thread => thread[0]._id === parentReply._id) || [];
  }
}
