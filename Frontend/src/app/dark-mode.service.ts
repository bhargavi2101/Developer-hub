import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private currentTheme: Theme = 'auto';
  private themeSubject = new BehaviorSubject<Theme>('auto');
  theme$ = this.themeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadThemePreference();
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }

    this.applyTheme();
    this.themeSubject.next(this.currentTheme);
  }

  setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
    this.themeSubject.next(theme);
  }

  toggleTheme() {
    if (this.currentTheme === 'light') {
      this.setTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.setTheme('light');
    } else {
      // Toggle between light and dark for auto mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'light' : 'dark');
    }
  }

  private applyTheme() {
    const isDark = this.isDarkMode();

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Update meta theme-color
    this.updateMetaThemeColor(isDark);
  }

  private updateMetaThemeColor(isDark: boolean) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1a1a2e' : '#667eea');
    }
  }

  isDarkMode(): boolean {
    if (this.currentTheme === 'dark') {
      return true;
    } else if (this.currentTheme === 'light') {
      return false;
    } else {
      // Auto mode - check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  // Listen for system theme changes
  listenForSystemThemeChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        this.applyTheme();
        this.themeSubject.next(this.currentTheme);
      }
    });
  }

  // Update user preference on server
  updateUserPreference(theme: Theme): Observable<any> {
    return this.http.put('/api/users/preferences', {
      theme
    });
  }
}
