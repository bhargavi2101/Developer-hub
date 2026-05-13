import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any = {};
  private currentLanguage: string = 'en';
  private loadedLanguages: Set<string> = new Set();

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {
    // Initialize with English as default
    this.currentLanguage = this.languageService.getCurrentLanguage().code;
    this.loadTranslations(this.currentLanguage);

    // Listen for language changes
    this.languageService.currentLanguage$.subscribe(language => {
      const newLangCode = language.code;
      if (newLangCode !== this.currentLanguage) {
        this.currentLanguage = newLangCode;
        this.loadTranslations(newLangCode);
      }
    });
  }

  // Load translations for a specific language
  loadTranslations(languageCode: string): Observable<any> {
    // Return cached translations if already loaded
    if (this.loadedLanguages.has(languageCode)) {
      return of(this.getTranslations());
    }

    // Load from JSON file
    return this.http.get<any>(`/assets/i18n/${languageCode}.json`).pipe(
      map(translations => {
        this.translations = translations;
        this.loadedLanguages.add(languageCode);
        this.applyRTL(languageCode);
        return translations;
      }),
      catchError(error => {
        console.error('Failed to load translations:', error);
        // Fallback to English
        if (languageCode !== 'en') {
          return this.loadTranslations('en');
        }
        return of({});
      })
    );
  }

  // Get current translations
  getTranslations(): any {
    return this.translations;
  }

  // Translate a key with optional parameters
  translate(key: string, params?: any[]): string {
    if (!key) return '';

    // Split key by dots to navigate nested objects
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Handle string vs object
    if (typeof value === 'string') {
      // Replace parameters if provided
      if (params && params.length > 0) {
        return value.replace(/\{(\d+)\}/g, (match: string, index: string) => {
          const paramIndex = parseInt(index);
          return params[paramIndex] !== undefined ? params[paramIndex] : match;
        });
      }
      return value;
    }

    return key;
  }

  // Get a translation as Observable
  translateAsync(key: string, params?: any[]): Observable<string> {
    return of(this.translate(key, params));
  }

  // Batch translate multiple keys
  translateMultiple(keys: string[]): { [key: string]: string } {
    const translations: { [key: string]: string } = {};

    for (const key of keys) {
      translations[key] = this.translate(key);
    }

    return translations;
  }

  // Check if translation exists
  hasTranslation(key: string): boolean {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return false;
      }
    }

    return typeof value === 'string';
  }

  // Apply RTL direction
  private applyRTL(languageCode: string): void {
    const language = this.languageService.getAvailableLanguages().find(l => l.code === languageCode);
    const isRTL = language?.rtl || false;

    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  }

  // Reload translations for current language
  reloadTranslations(): void {
    this.loadTranslations(this.currentLanguage);
  }

  // Get current language code
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}