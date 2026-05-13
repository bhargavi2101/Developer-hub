import { Component, OnInit } from '@angular/core';
import { ExperienceLevel, RoadmapService, SubTechnology, TechnologyRoadmap } from '../roadmap-service';
import { Router } from '@angular/router';

type LevelFilter = 'All' | ExperienceLevel;

@Component({
  selector: 'app-roadmaps',
  standalone: false,
  templateUrl: './roadmaps.html',
  styleUrl: './roadmaps.css',
})
export class Roadmaps implements OnInit {
  allTechnologies: TechnologyRoadmap[] = [];
  filteredTechnologies: TechnologyRoadmap[] = [];

  readonly levels: LevelFilter[] = ['All', 'Fresher', 'Experienced'];
  selectedLevel: LevelFilter = 'All';
  searchTerm = '';

  constructor(private roadmapService: RoadmapService, private router: Router) {}

  ngOnInit(): void {
    this.roadmapService.getTechnologyCatalog().subscribe((items) => {
      this.allTechnologies = items;
      this.applyFilters();
    });
  }

  setLevel(level: LevelFilter): void {
    this.selectedLevel = level;
    this.applyFilters();
  }

  updateSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  openTechnology(technology: TechnologyRoadmap): void {
    // Navigate to the technology page instead of showing details on the same page
    this.router.navigate(['/roadmaps', technology.id]);
  }

  private applyFilters(): void {
    const query = this.searchTerm.trim().toLowerCase();

    this.filteredTechnologies = this.allTechnologies.filter((technology) => {
      const matchesLevel =
        this.selectedLevel === 'All' || technology.levels.includes(this.selectedLevel);

      const matchesQuery =
        query.length === 0 ||
        technology.technology.toLowerCase().includes(query) ||
        technology.category.toLowerCase().includes(query) ||
        technology.overview.toLowerCase().includes(query);

      return matchesLevel && matchesQuery;
    });
  }
}