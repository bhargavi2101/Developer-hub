import { Injectable } from '@angular/core';

export interface ApiError {
  status?: number;
  message?: string;
  errors?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorMessages: { [key: number]: string } = {
    400: 'Bad Request - Please check your input',
    401: 'Unauthorized - Please login again',
    403: 'Forbidden - You don\'t have permission',
    404: 'Not Found - Resource doesn\'t exist',
    500: 'Server Error - Please try again later',
    503: 'Service Unavailable - Please try again later'
  };

  handleError(error: any): string {
    console.error('API Error:', error);

    // Handle HTTP errors
    if (error.status) {
      const status = error.status as number;
      const errorMessage = error.error?.msg || error.error?.message || this.errorMessages[status] || 'An error occurred';
      return errorMessage;
    }

    // Handle network errors
    if (error.message) {
      if (error.message.includes('NetworkError')) {
        return 'Network error - Please check your connection';
      }
      if (error.message.includes('timeout')) {
        return 'Request timeout - Please try again';
      }
    }

    // Default error message
    return 'An unexpected error occurred';
  }

  handleAuthError(error: any): string {
    const message = this.handleError(error);
    if (error.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
    }
    return message;
  }

  handleRoadmapError(error: any): string {
    const message = this.handleError(error);
    if (error.status === 404) {
      return 'Roadmap not found';
    }
    if (error.status === 409) {
      return 'Roadmap already exists';
    }
    return message;
  }

  handleProfileError(error: any): string {
    const message = this.handleError(error);
    if (error.status === 409) {
      return 'Username or email already taken';
    }
    return message;
  }

  isNetworkError(error: any): boolean {
    return error.message?.includes('NetworkError') || error.message?.includes('timeout');
  }

  isAuthError(error: any): boolean {
    return error.status === 401 || error.status === 403;
  }

  isServerError(error: any): boolean {
    return error.status >= 500;
  }

  showUserFriendlyError(error: any): string {
    const message = this.handleError(error);

    // Add additional context for specific error types
    if (this.isNetworkError(error)) {
      return `${message}. Please check your internet connection.`;
    }

    if (this.isAuthError(error)) {
      return `${message}. You may need to login again.`;
    }

    if (this.isServerError(error)) {
      return `${message}. Our team has been notified.`;
    }

    return message;
  }
}
