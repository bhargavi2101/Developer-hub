import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService, Language } from '../language.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: false,
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcher implements OnInit, OnDestroy {
  currentLanguage: Language = {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  };
  availableLanguages: Language[] = [];
  filteredLanguages: Language[] = [];
  isDropdownOpen = false;
  searchTerm = '';

  constructor(
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    // Get current language
    this.currentLanguage = this.languageService.getCurrentLanguage();

    // Get available languages
    this.availableLanguages = this.languageService.getAvailableLanguages();
    this.filteredLanguages = [...this.availableLanguages];

    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event: Event) => {
    if (!event.target) return;
    const target = event.target as HTMLElement;
    const switcher = document.querySelector('.language-switcher');
    if (switcher && !switcher.contains(target)) {
      this.isDropdownOpen = false;
    }
  };

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchTerm = '';
      this.filterLanguages();
    }
  }

  selectLanguage(language: Language) {
    this.languageService.setLanguage(language.code);
    this.currentLanguage = language;
    this.isDropdownOpen = false;

    // Reload page to apply new language
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  filterLanguages() {
    if (!this.searchTerm.trim()) {
      this.filteredLanguages = [...this.availableLanguages];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredLanguages = this.availableLanguages.filter(language =>
      language.name.toLowerCase().includes(searchLower) ||
      language.nativeName.toLowerCase().includes(searchLower) ||
      language.code.toLowerCase().includes(searchLower)
    );
  }

  // Translate method using TranslationService
  translate(key: string): string {
    return this.translationService.translate(key);
  }
}