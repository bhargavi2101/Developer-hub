import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
}

interface BadgeProgress {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
  progress: number;
  currentCount: number;
  targetCount: number;
  isUnlocked: boolean;
  unlockedAt: Date | null;
}

@Component({
  selector: 'app-badges',
  standalone: false,
  templateUrl: './badges.html',
  styleUrl: './badges.css',
})
export class Badges implements OnInit {
  allBadges: Badge[] = [];
  userBadges: BadgeProgress[] = [];
  filteredBadges: BadgeProgress[] = [];
  isLoading = false;
  errorMessage = '';
  selectedCategory = 'all';
  selectedRarity = 'all';

  categories = ['all', 'learning', 'engagement', 'achievement', 'special'];
  rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAllBadges();
    this.loadUserBadges();
  }

  loadAllBadges() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get('http://localhost:3000/api/badges').subscribe({
      next: (res: any) => {
        console.log('All badges loaded:', res);
        this.allBadges = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading badges:', err);
        this.errorMessage = 'Failed to load badges';
        this.isLoading = false;
      }
    });
  }

  loadUserBadges() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get('http://localhost:3000/api/badges/progress', { headers }).subscribe({
      next: (res: any) => {
        console.log('User badges loaded:', res);
        this.userBadges = res;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading user badges:', err);
        this.errorMessage = 'Failed to load user badges';
      }
    });
  }

  applyFilters() {
    this.filteredBadges = this.userBadges.filter(badge => {
      const categoryMatch = this.selectedCategory === 'all' || badge.category === this.selectedCategory;
      const rarityMatch = this.selectedRarity === 'all' || badge.rarity === this.selectedRarity;
      return categoryMatch && rarityMatch;
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  setRarity(rarity: string) {
    this.selectedRarity = rarity;
    this.applyFilters();
  }

  getRarityColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity] || colors['common'];
  }

  getRarityBorder(rarity: string): string {
    const borders: { [key: string]: string } = {
      common: '2px solid #9ca3af',
      rare: '2px solid #3b82f6',
      epic: '2px solid #8b5cf6',
      legendary: '2px solid #f59e0b'
    };
    return borders[rarity] || borders['common'];
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      learning: '📚',
      engagement: '🔥',
      achievement: '🏆',
      special: '⭐'
    };
    return icons[category] || '🏅';
  }

  getUnlockedDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}