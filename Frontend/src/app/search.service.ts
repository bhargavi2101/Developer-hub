import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUrl = 'http://localhost:3000/api/search';

  constructor(private http: HttpClient) {}

  // Search users with filters
  searchUsers(query: string, filters?: SearchFilters): Observable<SearchResult> {
    const params = this.buildSearchParams(query, filters);
    return this.http.get<SearchResult>(`${this.searchUrl}/users`, { params });
  }

  // Search technologies with filters
  searchTechnologies(query: string, filters?: SearchFilters): Observable<SearchResult> {
    const params = this.buildSearchParams(query, filters);
    return this.http.get<SearchResult>(`${this.searchUrl}/technologies`, { params });
  }

  // Search posts with filters
  searchPosts(query: string, filters?: SearchFilters): Observable<SearchResult> {
    const params = this.buildSearchParams(query, filters);
    return this.http.get<SearchResult>(`${this.searchUrl}/posts`, { params });
  }

  // Search forums with filters
  searchForums(query: string, filters?: SearchFilters): Observable<SearchResult> {
    const params = this.buildSearchParams(query, filters);
    return this.http.get<SearchResult>(`${this.searchUrl}/forums`, { params });
  }

  // Global search across all entities
  globalSearch(query: string, limit: number = 5): Observable<GlobalSearchResult> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());
    return this.http.get<GlobalSearchResult>(`${this.searchUrl}/global`, { params });
  }

  // Get autocomplete suggestions
  getAutocompleteSuggestions(query: string, type: string = 'all'): Observable<AutocompleteResult> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', type);
    return this.http.get<AutocompleteResult>(`${this.searchUrl}/autocomplete`, { params });
  }

  // Get available filters for search type
  getAvailableFilters(type: string): Observable<FiltersResponse> {
    return this.http.get<FiltersResponse>(`${this.searchUrl}/filters/${type}`);
  }

  // Clear search cache (admin only)
  clearSearchCache(pattern?: string): Observable<{ success: boolean; message: string }> {
    const params = pattern ? new HttpParams().set('pattern', pattern) : undefined;
    return this.http.delete<{ success: boolean; message: string }>(`${this.searchUrl}/cache`, { params });
  }

  // Create a debounced search observable
  createDebouncedSearch(searchTerm$: Subject<string>, searchType: string, filters?: SearchFilters): Observable<SearchResult> {
    return searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.search(term, searchType, filters))
    );
  }

  // Generic search method
  private search(query: string, type: string, filters?: SearchFilters): Observable<SearchResult> {
    switch (type) {
      case 'users':
        return this.searchUsers(query, filters);
      case 'technologies':
        return this.searchTechnologies(query, filters);
      case 'posts':
        return this.searchPosts(query, filters);
      case 'forums':
        return this.searchForums(query, filters);
      default:
        return this.searchUsers(query, filters);
    }
  }

  // Build HTTP parameters from filters
  private buildSearchParams(query: string, filters?: SearchFilters): HttpParams {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }

    if (filters) {
      if (filters.location) params = params.set('location', filters.location);
      if (filters.skills) params = params.set('skills', filters.skills.join(','));
      if (filters.interests) params = params.set('interests', filters.interests.join(','));
      if (filters.minPoints) params = params.set('minPoints', filters.minPoints.toString());
      if (filters.category) params = params.set('category', filters.category);
      if (filters.levels) params = params.set('levels', filters.levels.join(','));
      if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
      if (filters.tags) params = params.set('tags', filters.tags.join(','));
      if (filters.type) params = params.set('type', filters.type);
      if (filters.visibility) params = params.set('visibility', filters.visibility);
      if (filters.technologyId) params = params.set('technologyId', filters.technologyId);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.offset) params = params.set('offset', filters.offset.toString());
    }

    return params;
  }
}

// Interfaces for search types
export interface SearchFilters {
  location?: string;
  skills?: string[];
  interests?: string[];
  minPoints?: number;
  category?: string;
  levels?: string[];
  difficulty?: string;
  tags?: string[];
  type?: string;
  visibility?: string;
  technologyId?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  success: boolean;
  data: any[];
  total: number;
  filters?: any;
}

export interface GlobalSearchResult {
  success: boolean;
  users: any[];
  technologies: any[];
  posts: any[];
  forums: any[];
  total: number;
  query: string;
}

export interface AutocompleteResult {
  success: boolean;
  suggestions: AutocompleteSuggestion[];
  query: string;
}

export interface AutocompleteSuggestion {
  type: 'user' | 'technology';
  id: string;
  text: string;
  avatar?: string;
  username?: string;
  category?: string;
}

export interface FiltersResponse {
  success: boolean;
  filters: {
    [key: string]: string | string[];
  };
  type: string;
}