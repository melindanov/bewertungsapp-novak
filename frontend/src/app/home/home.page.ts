import { Component, OnInit, inject, signal } from '@angular/core';

import { ApiService } from '../services/api.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  private api = inject(ApiService);

  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.error.set(null);
    this.api.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Projekte konnten nicht geladen werden. Läuft das Backend auf http://localhost:3000?');
        this.loading.set(false);
      },
    });
  }
}
