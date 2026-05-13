import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: false,
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenter implements OnInit {
  notifications: Notification[] = [];
  isLoading = false;
  errorMessage = '';
  activeTab = 'all';
  unreadCount = 0;

  currentPage = 1;
  resultsPerPage = 20;
  hasMore = false;
  isLoadingMore = false;

  notificationTabs = [
    { type: 'all', label: 'All', icon: '🔔' },
    { type: 'unread', label: 'Unread', icon: '📬' },
    { type: 'achievement', label: 'Achievements', icon: '🏆' },
    { type: 'social', label: 'Social', icon: '💬' },
    { type: 'system', label: 'System', icon: '⚙️' }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications() {
    this.isLoading = true;
    this.errorMessage = '';

    const options = {
      limit: this.resultsPerPage,
      offset: (this.currentPage - 1) * this.resultsPerPage,
      unreadOnly: this.activeTab === 'unread',
      type: this.activeTab === 'all' || this.activeTab === 'unread' || this.activeTab === 'social' ? undefined : this.activeTab
    };

    this.notificationService.getUserNotifications(options).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.notifications = response.notifications;
        } else {
          this.notifications = [...this.notifications, ...response.notifications];
        }

        this.hasMore = this.notifications.length < response.total;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load notifications. Please try again.';
        this.isLoading = false;
        this.isLoadingMore = false;
        console.error('Load notifications error:', error);
      }
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        if (response.success) {
          this.unreadCount = response.count;
        }
      },
      error: (error: any) => {
        console.error('Load unread count error:', error);
      }
    });
  }

  loadMoreNotifications() {
    if (this.isLoadingMore || !this.hasMore) {
      return;
    }

    this.currentPage++;
    this.isLoadingMore = true;
    this.loadNotifications();
  }

  refreshNotifications() {
    this.currentPage = 1;
    this.loadNotifications();
    this.loadUnreadCount();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
    this.notifications = [];
    this.loadNotifications();
  }

  openNotification(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead([notification._id]).subscribe({
        next: () => {
          // Update local state
          notification.isRead = true;
          notification.readAt = new Date();
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (error: any) => {
          console.error('Mark as read error:', error);
        }
      });
    }

    // Navigate to relevant page
    this.navigateToNotification(notification);
  }

  deleteNotification(notificationId: string, event: Event) {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(notificationId).subscribe({
        next: () => {
          // Remove from local state
          this.notifications = this.notifications.filter(n => n._id !== notificationId);
        },
        error: (error: any) => {
          console.error('Delete notification error:', error);
        }
      });
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        // Update local state
        this.notifications = this.notifications.map(notif => ({
          ...notif,
          isRead: true,
          readAt: new Date()
        }));
        this.unreadCount = 0;
      },
      error: (error: any) => {
        console.error('Mark all as read error:', error);
      }
    });
  }

  navigateToNotification(notification: Notification) {
    let route = '/dashboard';

    switch (notification.type) {
      case 'achievement':
      case 'badge':
        route = '/badges';
        break;
      case 'follow':
        if (notification.data?.followerUsername) {
          route = `/profile/${notification.data.followerUsername}`;
        }
        break;
      case 'like':
      case 'comment':
        route = '/social-feed';
        break;
      case 'forum_reply':
        if (notification.relatedForumId) {
          route = `/forum-topic/${notification.relatedForumId}`;
        }
        break;
      case 'learning_milestone':
        route = '/dashboard';
        break;
      case 'quiz_result':
        if (notification.data?.quizId) {
          route = `/quiz/${notification.data.quizId}`;
        }
        break;
      case 'system':
        route = '/dashboard';
        break;
    }

    // Use window.location to navigate (works with Angular routing)
    window.location.href = route;
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      achievement: '🏆',
      follow: '👤',
      like: '❤️',
      comment: '💬',
      forum_reply: '📝',
      badge: '🎖️',
      learning_milestone: '🎯',
      quiz_result: '📋',
      social_update: '📢',
      system: '⚙️'
    };

    return icons[type] || '🔔';
  }

  getTabCount(tab: string): number {
    if (tab === 'all') {
      return this.notifications.length;
    } else if (tab === 'unread') {
      return this.unreadCount;
    } else {
      return this.notifications.filter(n => n.type === tab && !n.isRead).length;
    }
  }

  formatTime(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();

    // Less than a minute
    if (diffMs < 60000) {
      return 'Just now';
    }

    // Less than an hour
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes}m ago`;
    }

    // Less than a day
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours}h ago`;
    }

    // Less than a week
    if (diffMs < 604800000) {
      const days = Math.floor(diffMs / 86400000);
      return `${days}d ago`;
    }

    // More than a week
    return notificationDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}