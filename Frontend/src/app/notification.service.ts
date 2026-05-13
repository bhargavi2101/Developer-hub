import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsUrl = 'http://localhost:3000/api/notifications';

  // BehaviorSubject for real-time notification updates
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  // Subject for notification polling
  private notificationRefresh$ = new Subject<void>();

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // Set up polling for new notifications (every 30 seconds)
    this.notificationRefresh$
      .pipe(debounceTime(30000))
      .subscribe(() => this.refreshNotifications());
  }

  // Get user notifications
  getUserNotifications(options?: NotificationOptions): Observable<NotificationResponse> {
    const params = this.buildParams(options);
    return this.http.get<NotificationResponse>(this.notificationsUrl, { params }).pipe(
      tap(response => {
        if (options?.unreadOnly) {
          // Only update if getting unread
          this.unreadCountSubject.next(response.unreadCount);
        } else {
          // Update all notifications
          this.notificationsSubject.next(response.notifications);
        }
      })
    );
  }

  // Get unread notification count
  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(`${this.notificationsUrl}/unread-count`).pipe(
      tap(response => {
        if (response.success) {
          this.unreadCountSubject.next(response.count);
        }
      })
    );
  }

  // Mark notifications as read
  markAsRead(notificationIds: string[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.notificationsUrl}/read`, { notificationIds }).pipe(
      tap(() => {
        // Update local state
        const currentNotifications = this.notificationsSubject.getValue();
        const updatedNotifications = currentNotifications.map(notif =>
          notificationIds.includes(notif._id) ? { ...notif, isRead: true, readAt: new Date() } : notif
        );
        this.notificationsSubject.next(updatedNotifications);

        // Update unread count
        const currentUnreadCount = this.unreadCountSubject.getValue();
        this.unreadCountSubject.next(Math.max(0, currentUnreadCount - notificationIds.length));
      })
    );
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.notificationsUrl}/read-all`, {}).pipe(
      tap(() => {
        // Update local state
        const currentNotifications = this.notificationsSubject.getValue();
        const updatedNotifications = currentNotifications.map(notif => ({
          ...notif,
          isRead: true,
          readAt: new Date()
        }));
        this.notificationsSubject.next(updatedNotifications);

        // Reset unread count
        this.unreadCountSubject.next(0);
      })
    );
  }

  // Delete notification
  deleteNotification(notificationId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.notificationsUrl}/${notificationId}`).pipe(
      tap(() => {
        // Update local state
        const currentNotifications = this.notificationsSubject.getValue();
        const updatedNotifications = currentNotifications.filter(notif => notif._id !== notificationId);
        this.notificationsSubject.next(updatedNotifications);

        // Refresh unread count
        this.refreshNotifications();
      })
    );
  }

  // Refresh notifications
  refreshNotifications(): void {
    this.notificationRefresh$.next();
  }

  // Create notification (for internal use)
  createNotification(notificationData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.notificationsUrl, notificationData);
  }

  // Build HTTP params from options
  private buildParams(options?: NotificationOptions): HttpParams {
    let params = new HttpParams();

    if (options) {
      if (options.limit) params = params.set('limit', options.limit.toString());
      if (options.offset) params = params.set('offset', options.offset.toString());
      if (options.unreadOnly) params = params.set('unreadOnly', 'true');
      if (options.type) params = params.set('type', options.type);
    }

    return params;
  }

  // Get current notifications (synchronous)
  getCurrentNotifications(): any[] {
    return this.notificationsSubject.getValue();
  }

  // Get current unread count (synchronous)
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.getValue();
  }

  // Clear local notification state
  clearLocalState(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }
}

// Interfaces for notification types
export interface NotificationOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: any;
  priority: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  relatedUserId?: any;
  relatedPostId?: any;
  relatedForumId?: any;
  relatedBadgeId?: any;
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export interface ApiResponse {
  success: boolean;
  notification?: any;
  error?: string;
}