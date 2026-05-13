import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchService, SearchFilters, SearchResult, GlobalSearchResult, AutocompleteResult } from '../search.service';

@Component({
  selector: 'app-advanced-search',
  standalone: false,
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearch implements OnInit {
  searchQuery = '';
  currentSearchType = 'global';
  isLoading = false;
  errorMessage = '';
  showFilters = false;
  showAutocomplete = false;

  searchTerms$ = new Subject<string>();
  suggestions: any[] = [];
  globalResults: GlobalSearchResult | null = null;
  currentResults: SearchResult | null = null;

  currentPage = 1;
  resultsPerPage = 20;
  sortBy = 'createdAt';

  filterValues: any = {};
  availableFilters: any[] = [];
  currentFilters: any[] = [];

  searchTabs = [
    { type: 'global', label: 'All', icon: '🔍' },
    { type: 'users', label: 'Users', icon: '👤' },
    { type: 'technologies', label: 'Technologies', icon: '📚' },
    { type: 'posts', label: 'Posts', icon: '💬' },
    { type: 'forums', label: 'Forums', icon: '📝' }
  ];

  sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Newest', value: 'createdAt' },
    { label: 'Most Popular', value: 'popularity' },
    { label: 'Most Likes', value: 'likes' }
  ];

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.loadAvailableFilters();
  }

  loadAvailableFilters() {
    this.searchService.getAvailableFilters(this.currentSearchType).subscribe({
      next: (response) => {
        this.availableFilters = this.parseAvailableFilters(response.filters);
      },
      error: (error: any) => {
        console.error('Error loading filters:', error);
      }
    });
  }

  parseAvailableFilters(filters: any): any[] {
    return Object.keys(filters).map(key => ({
      key,
      label: this.formatFilterLabel(key),
      type: this.getFilterType(filters[key]),
      options: this.getFilterOptions(key, filters[key])
    }));
  }

  formatFilterLabel(key: string): string {
    const labels: { [key: string]: string } = {
      location: 'Location',
      skills: 'Skills',
      interests: 'Interests',
      minPoints: 'Minimum Points',
      category: 'Category',
      levels: 'Difficulty Levels',
      difficulty: 'Difficulty',
      tags: 'Tags',
      type: 'Type',
      visibility: 'Visibility',
      technologyId: 'Technology'
    };
    return labels[key] || key;
  }

  getFilterType(filter: any): string {
    if (typeof filter === 'string') return 'text';
    if (Array.isArray(filter)) return 'multi-select';
    if (typeof filter === 'object') return 'select';
    return 'text';
  }

  getFilterOptions(key: string, filter: any): string[] {
    const optionsMap: { [key: string]: string[] } = {
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      difficulty: ['Beginner', 'Intermediate', 'Advanced'],
      type: ['text', 'image', 'link'],
      visibility: ['public', 'private', 'connections']
    };

    if (Array.isArray(filter)) {
      return filter;
    }

    return optionsMap[key] || [];
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;

    if (query.length >= 2) {
      this.loadAutocompleteSuggestions(query);
    } else {
      this.showAutocomplete = false;
    }
  }

  loadAutocompleteSuggestions(query: string) {
    this.searchService.getAutocompleteSuggestions(query, 'all').subscribe({
      next: (response: AutocompleteResult) => {
        this.suggestions = response.suggestions;
        this.showAutocomplete = true;
      },
      error: (error: any) => {
        console.error('Error loading suggestions:', error);
        this.showAutocomplete = false;
      }
    });
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.text;
    this.showAutocomplete = false;

    if (suggestion.type === 'user') {
      window.location.href = `/profile/${suggestion.username}`;
    } else if (suggestion.type === 'technology') {
      window.location.href = `/roadmaps/${suggestion.id}`;
    }
  }

  performSearch() {
    if (!this.searchQuery || this.searchQuery.trim().length < 2) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.currentPage = 1;

    if (this.currentSearchType === 'global') {
      this.performGlobalSearch();
    } else {
      this.performTypedSearch();
    }
  }

  performGlobalSearch() {
    this.searchService.globalSearch(this.searchQuery, 5).subscribe({
      next: (response: GlobalSearchResult) => {
        this.globalResults = response;
        this.currentResults = null;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to perform search. Please try again.';
        this.isLoading = false;
        console.error('Search error:', error);
      }
    });
  }

  performTypedSearch() {
    const filters = this.buildFilters();
    this.performSearchByType(this.currentSearchType, filters);
  }

  performSearchByType(type: string, filters: SearchFilters) {
    const searchMethod = this.getSearchMethod(type);

    if (searchMethod) {
      searchMethod.call(this.searchService, this.searchQuery, filters).subscribe({
        next: (response: SearchResult) => {
          this.currentResults = response;
          this.globalResults = null;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to perform search. Please try again.';
          this.isLoading = false;
          console.error('Search error:', error);
        }
      });
    }
  }

  getSearchMethod(type: string) {
    const methods: { [key: string]: Function } = {
      users: this.searchService.searchUsers,
      technologies: this.searchService.searchTechnologies,
      posts: this.searchService.searchPosts,
      forums: this.searchService.searchForums
    };

    return methods[type];
  }

  setSearchType(type: string) {
    this.currentSearchType = type;
    this.currentPage = 1;
    this.loadAvailableFilters();

    if (this.searchQuery) {
      this.performSearch();
    }
  }

  buildFilters(): SearchFilters {
    return {
      ...this.filterValues,
      sortBy: this.sortBy,
      limit: this.resultsPerPage,
      offset: (this.currentPage - 1) * this.resultsPerPage
    };
  }

  applyFilters() {
    this.currentPage = 1;
    if (this.searchQuery) {
      this.performTypedSearch();
    }
  }

  clearFilters() {
    this.filterValues = {};
    this.showFilters = false;
    this.currentPage = 1;

    if (this.searchQuery) {
      this.performTypedSearch();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.showAutocomplete = false;
    this.globalResults = null;
    this.currentResults = null;
    this.filterValues = {};
  }

  isMultiSelectSelected(filterKey: string, option: string): boolean {
    if (!this.filterValues[filterKey]) {
      return false;
    }
    return this.filterValues[filterKey].includes(option);
  }

  toggleMultiSelectOption(filterKey: string, option: string) {
    if (!this.filterValues[filterKey]) {
      this.filterValues[filterKey] = [];
    }

    const index = this.filterValues[filterKey].indexOf(option);
    if (index > -1) {
      this.filterValues[filterKey].splice(index, 1);
    } else {
      this.filterValues[filterKey].push(option);
    }

    this.applyFilters();
  }

  updateFilterValue(key: string, value: any) {
    this.filterValues[key] = value;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.performTypedSearch();
  }

  getResultTitle(): string {
    const titles: { [key: string]: string } = {
      users: 'Users',
      technologies: 'Technologies',
      posts: 'Posts',
      forums: 'Forums'
    };

    return titles[this.currentSearchType] || 'Results';
  }

  getTabCount(type: string): number {
    if (!this.globalResults) {
      return 0;
    }

    const countMap: { [key: string]: number } = {
      users: this.globalResults.users?.length || 0,
      technologies: this.globalResults.technologies?.length || 0,
      posts: this.globalResults.posts?.length || 0,
      forums: this.globalResults.forums?.length || 0
    };

    return countMap[type] || 0;
  }

  getTotalPages(): number {
    if (!this.currentResults) {
      return 1;
    }

    return Math.ceil(this.currentResults.total / this.resultsPerPage);
  }

  get totalPages(): number {
    return this.getTotalPages();
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Web': '🌐',
      'Mobile': '📱',
      'Backend': '⚙️',
      'DevOps': '🚀',
      'AI': '🤖',
      'Security': '🔒',
      'Data Science': '📊'
    };

    return icons[category] || '📚';
  }

  trackFilterBy(index: number, item: any): any {
    return item ? item.key : index;
  }
}