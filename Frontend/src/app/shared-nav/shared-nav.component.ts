import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../language.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-shared-nav',
  standalone: false,
  templateUrl: './shared-nav.component.html',
  styleUrls: ['./shared-nav.component.css']
})
export class SharedNav implements OnInit {
  isRTL = false;
  unreadCount = 0;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.updateRTL();

    // Listen for language changes
    this.languageService.currentLanguage$.subscribe(language => {
      this.isRTL = language.rtl;
      this.applyRTL();
    });

    // Watch for notification count changes
    this.loadNotificationCount();
  }

  updateRTL(): void {
    this.isRTL = this.languageService.isRTL();
    this.applyRTL();
  }

  applyRTL(): void {
    document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to login
    this.router.navigate(['/login']);
  }

  // Simple translate method
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  loadNotificationCount(): void {
    // This would integrate with notification service
    // For now, set to 0
    this.unreadCount = 0;
  }
}