import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>({
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  });
  currentLanguage$: Observable<Language> = this.currentLanguageSubject.asObservable();

  // Available languages
  private languages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      rtl: false
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      rtl: false
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      rtl: false
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      rtl: false
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      rtl: false
    }
  ];

  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && this.isValidLanguage(savedLanguage)) {
      this.setLanguage(savedLanguage, false);
    } else {
      // Detect browser language
      this.detectBrowserLanguage();
    }

    // Listen for language changes
    this.currentLanguage$.subscribe(language => {
      this.applyLanguageChanges(language);
    });
  }

  // Get current language
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.getValue();
  }

  // Get all available languages
  getAvailableLanguages(): Language[] {
    return this.languages;
  }

  // Set language
  setLanguage(languageCode: string, save = true): void {
    if (this.isValidLanguage(languageCode)) {
      const language = this.languages.find(l => l.code === languageCode);
      if (language) {
        this.currentLanguageSubject.next(language);
        if (save) {
          localStorage.setItem('preferredLanguage', languageCode);
        }
      }
    }
  }

  // Validate language code
  private isValidLanguage(languageCode: string): boolean {
    return this.languages.some(l => l.code === languageCode);
  }

  // Detect browser language
  private detectBrowserLanguage(): void {
    const browserLang = navigator.language;
    if (browserLang) {
      const langCode = browserLang.split('-')[0]; // Get primary language code
      if (this.isValidLanguage(langCode)) {
        this.setLanguage(langCode);
      } else {
        // Fallback to English
        this.setLanguage('en');
      }
    } else {
      this.setLanguage('en');
    }
  }

  // Apply language changes to the page
  private applyLanguageChanges(language: Language): void {
    // Set document direction for RTL support
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';

    // Set document language
    document.documentElement.lang = language.code;

    // Update page title direction
    const title = document.querySelector('title');
    if (title) {
      title.dir = language.rtl ? 'rtl' : 'ltr';
    }
  }

  // Check if current language is RTL
  isRTL(): boolean {
    return this.getCurrentLanguage().rtl;
  }

  // Get language name
  getLanguageName(languageCode: string): string {
    const language = this.languages.find(l => l.code === languageCode);
    return language ? language.name : languageCode;
  }

  // Format date according to current language
  formatDate(date: Date | string): string {
    const language = this.getCurrentLanguage();
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString(language.code, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format time according to current language
  formatTime(date: Date | string): string {
    const language = this.getCurrentLanguage();
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleTimeString(language.code, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format date and time
  formatDateTime(date: Date | string): string {
    const language = this.getCurrentLanguage();
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleString(language.code, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    const language = this.getCurrentLanguage();
    const rtf = new Intl.RelativeTimeFormat(language.code, { numeric: 'auto' });

    if (diffSecs < 60) {
      return rtf.format(-diffSecs, 'second');
    } else if (diffMins < 60) {
      return rtf.format(-diffMins, 'minute');
    } else if (diffHours < 24) {
      return rtf.format(-diffHours, 'hour');
    } else if (diffDays < 7) {
      return rtf.format(-diffDays, 'day');
    } else {
      return this.formatDateTime(date);
    }
  }

  // Format number according to current language
  formatNumber(number: number): string {
    const language = this.getCurrentLanguage();
    return new Intl.NumberFormat(language.code).format(number);
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    const language = this.getCurrentLanguage();
    return new Intl.NumberFormat(language.code, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Translate text (simple implementation)
  translate(key: string, params?: any[]): string {
    // This would integrate with Angular's i18n system
    // For now, return the key as a placeholder
    return key;
  }
}

// Language interface
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}