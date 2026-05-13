import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../roadmap-service';
import { AuthService } from '../auth-service';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  roadmaps: {
    total: number;
    completed: number;
    completionRate: string;
  };
  lessons: {
    total: number;
    completed: number;
    completionRate: string;
  };
  community: {
    totalPosts: number;
    totalForums: number;
    totalReplies: number;
  };
}

interface AdminLog {
  _id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetName: string;
  description: string;
  status: string;
  createdAt: string;
  timeAgo: string;
  errorMessage?: string;
  admin: {
    username: string;
    firstName: string;
    lastName: string;
  };
}

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isBanned: boolean;
  learningStreak: number;
  totalPoints: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;
  isLoadingStats = false;
  currentTab: 'dashboard' | 'users' | 'content' | 'moderation' | 'logs' = 'dashboard';

  // Users tab
  users: User[] = [];
  isLoadingUsers = false;
  searchQuery = '';
  selectedRole = '';
  userPagination = { page: 1, limit: 20, total: 0, pages: 0 };

  // Moderation tab
  flaggedContent: any[] = [];
  isLoadingFlagged = false;
  contentType: 'all' | 'posts' | 'forums' | 'replies' = 'all';

  // Logs tab
  adminLogs: AdminLog[] = [];
  isLoadingLogs = false;
  logFilters = { action: '', targetType: '', adminId: '' };
  logPagination = { page: 1, limit: 20, total: 0, pages: 0 };

  currentUser: any = null;

  constructor(
    private roadmapService: RoadmapService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.checkAdminAccess();
    this.loadDashboardStats();
  }

  checkAdminAccess() {
    if (!this.currentUser?.isAdmin) {
      alert('Admin access required');
      window.location.href = '/';
    }
  }

  loadDashboardStats() {
    this.isLoadingStats = true;
    this.roadmapService.getAdminStats().subscribe({
      next: (res: any) => {
        this.stats = res;
        this.isLoadingStats = false;
      },
      error: (err: any) => {
        console.error('Error loading admin stats:', err);
        this.isLoadingStats = false;
      }
    });
  }

  // Users Management
  loadUsers(page: number = 1) {
    this.isLoadingUsers = true;
    this.roadmapService.getAdminUsers({
      page,
      limit: this.userPagination.limit,
      search: this.searchQuery,
      role: this.selectedRole
    }).subscribe({
      next: (res: any) => {
        this.users = res.users;
        this.userPagination = res.pagination;
        this.isLoadingUsers = false;
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.isLoadingUsers = false;
      }
    });
  }

  searchUsers() {
    this.loadUsers(1);
  }

  updateAdminStatus(userId: string) {
    const user = this.users.find(u => u._id === userId);
    if (!user) return;

    const newStatus = confirm(`Make ${user.firstName} ${user.lastName} an ${user.isAdmin ? 'user' : 'admin'}?`);
    if (!newStatus) return;

    this.roadmapService.updateUserRole(userId, !user.isAdmin).subscribe({
      next: (res: any) => {
        user.isAdmin = !user.isAdmin;
        alert('User role updated successfully');
      },
      error: (err: any) => {
        console.error('Error updating user role:', err);
        alert('Failed to update user role');
      }
    });
  }

  toggleBan(userId: string) {
    const user = this.users.find(u => u._id === userId);
    if (!user) return;

    const action = user.isBanned ? 'unban' : 'ban';
    const reason = action === 'ban' ? (prompt('Enter ban reason:') || '') : '';

    if (action === 'ban' && reason === '') return;

    this.roadmapService.toggleUserBan(userId, action, reason).subscribe({
      next: (res: any) => {
        user.isBanned = !user.isBanned;
        alert(`User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`);
      },
      error: (err: any) => {
        console.error('Error toggling user ban:', err);
        alert('Failed to update user status');
      }
    });
  }

  deleteUser(userId: string) {
    const user = this.users.find(u => u._id === userId);
    if (!user) return;

    const confirmed = confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`);
    if (!confirmed) return;

    this.roadmapService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== userId);
        this.userPagination.total--;
        alert('User deleted successfully');
      },
      error: (err: any) => {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    });
  }

  // Moderation
  loadFlaggedContent() {
    this.isLoadingFlagged = true;
    this.roadmapService.getFlaggedContent(this.contentType).subscribe({
      next: (res: any) => {
        this.flaggedContent = res.content || [];
        this.isLoadingFlagged = false;
      },
      error: (err: any) => {
        console.error('Error loading flagged content:', err);
        this.isLoadingFlagged = false;
      }
    });
  }

  moderateContent(contentId: string, type: string) {
    const reason = prompt('Enter moderation reason:');
    if (!reason) return;

    const confirmed = confirm('Are you sure you want to remove this content?');
    if (!confirmed) return;

    this.roadmapService.moderateContent({ id: contentId, type, reason }).subscribe({
      next: () => {
        this.flaggedContent = this.flaggedContent.filter(c => c._id !== contentId);
        alert('Content removed successfully');
      },
      error: (err: any) => {
        console.error('Error moderating content:', err);
        alert('Failed to moderate content');
      }
    });
  }

  // Admin Logs
  loadAdminLogs(page: number = 1) {
    this.isLoadingLogs = true;
    this.roadmapService.getAdminLogs({
      page,
      limit: this.logPagination.limit,
      ...this.logFilters
    }).subscribe({
      next: (res: any) => {
        this.adminLogs = res.logs;
        this.logPagination = res.pagination;
        this.isLoadingLogs = false;
      },
      error: (err: any) => {
        console.error('Error loading admin logs:', err);
        this.isLoadingLogs = false;
      }
    });
  }

  // Tab navigation
  setTab(tab: string) {
    this.currentTab = tab as any;

    switch (tab) {
      case 'users':
        this.loadUsers();
        break;
      case 'moderation':
        this.loadFlaggedContent();
        break;
      case 'logs':
        this.loadAdminLogs();
        break;
    }
  }

  // Pagination
  loadNextUserPage() {
    if (this.userPagination.page < this.userPagination.pages) {
      this.loadUsers(this.userPagination.page + 1);
    }
  }

  loadPreviousUserPage() {
    if (this.userPagination.page > 1) {
      this.loadUsers(this.userPagination.page - 1);
    }
  }

  loadNextLogPage() {
    if (this.logPagination.page < this.logPagination.pages) {
      this.loadAdminLogs(this.logPagination.page + 1);
    }
  }

  loadPreviousLogPage() {
    if (this.logPagination.page > 1) {
      this.loadAdminLogs(this.logPagination.page - 1);
    }
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

  getActionColor(action: string): string {
    const colors: { [key: string]: string } = {
      CREATE_ROADMAP: '#10b981',
      UPDATE_ROADMAP: '#f59e0b',
      DELETE_ROADMAP: '#ef4444',
      CREATE_TECHNOLOGY: '#10b981',
      UPDATE_TECHNOLOGY: '#f59e0b',
      DELETE_TECHNOLOGY: '#ef4444',
      BAN_USER: '#ef4444',
      UNBAN_USER: '#10b981',
      DELETE_USER: '#ef4444',
      UPDATE_USER_ROLE: '#f59e0b',
      MODERATE_CONTENT: '#ef4444',
      SYSTEM_CONFIG: '#8b5cf6'
    };
    return colors[action] || '#6b7280';
  }

  getActionIcon(action: string): string {
    const icons: { [key: string]: string } = {
      CREATE_ROADMAP: '➕',
      UPDATE_ROADMAP: '✏️',
      DELETE_ROADMAP: '🗑️',
      CREATE_TECHNOLOGY: '➕',
      UPDATE_TECHNOLOGY: '✏️',
      DELETE_TECHNOLOGY: '🗑️',
      BAN_USER: '🚫',
      UNBAN_USER: '✅',
      DELETE_USER: '🗑️',
      UPDATE_USER_ROLE: '👤',
      MODERATE_CONTENT: '🔒',
      SYSTEM_CONFIG: '⚙️'
    };
    return icons[action] || '📋';
  }

  formatAction(action: string): string {
    return action.replace(/_/g, ' ');
  }
}
