import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Roadmap {
  title: string;
  description: string;
  icon: string;
  tag: string;
}

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  roadmaps: Roadmap[] = [
    { title: 'Frontend', description: 'Master HTML, CSS, Angular, and RxJS.', icon: 'icon-layout', tag: 'Popular' },
    { title: 'Backend', description: 'Node.js, Go, and Distributed Systems.', icon: 'icon-server', tag: 'Updated' },
    { title: 'DevOps', description: 'Kubernetes, Docker, and CI/CD pipelines.', icon: 'icon-infinity', tag: 'Hot' },
    { title: 'Mobile', description: 'Flutter, React Native, and Swift development.', icon: 'icon-smartphone', tag: 'New' },
    { title: 'AI & ML', description: 'Python, PyTorch, and Neural Networks.', icon: 'icon-cpu', tag: 'Advanced' },
    { title: 'Cybersecurity', description: 'Ethical hacking and Network security.', icon: 'icon-shield', tag: 'Security' }
  ];

  constructor(private router: Router) {}

  navigateToRoadmaps() {
    // Always redirect to login page
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/roadmaps' }
    });
  }
}
