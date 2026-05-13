import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoadmapService, TechnologyRoadmap, SubTechnology } from '../roadmap-service';

@Component({
  selector: 'app-technology-page',
  standalone: false,
  templateUrl: './technology-page.html',
  styleUrl: './technology-page.css',
})
export class TechnologyPage implements OnInit {
  technologyId: string = '';
  subTechnologyId: string = '';
  technology: TechnologyRoadmap | null = null;
  selectedSubTechnology: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roadmapService: RoadmapService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.technologyId = params['technologyId'];
      this.subTechnologyId = params['subTechnologyId'];
      this.loadTechnology();
    });
  }

  loadTechnology(): void {
    this.roadmapService.getTechnologyCatalog().subscribe((technologies: any[]) => {
      this.technology = technologies.find((tech: any) => tech.id === this.technologyId) || null;

      if (this.technology) {
        // If subTechnologyId is provided, select that sub-technology
        if (this.subTechnologyId) {
          this.selectedSubTechnology = this.technology.subTechnologies.find((sub: any) => sub.id === this.subTechnologyId) ||
            this.technology.subTechnologies[0] || null;
        }
      }

      this.isLoading = false;
    });
  }

  backToModules(): void {
    this.router.navigate(['/roadmaps', this.technologyId]);
  }

  backToRoadmaps(): void {
    this.router.navigate(['/roadmaps']);
  }

  markAsComplete(subTechnology: any): void {
    if (subTechnology) {
      subTechnology.completed = !subTechnology.completed;
      console.log('Marked as complete:', subTechnology.title);
    }
  }

  getResourceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'article': '📰',
      'documentation': '📚',
      'course': '🎓',
      'tool': '🛠️',
      'book': '📖'
    };
    return icons[type] || '🔗';
  }
}
