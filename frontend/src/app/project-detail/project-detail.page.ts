import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiService } from '../services/api.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
  standalone: false,
})
export class ProjectDetailPage implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  project = signal<Project | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProject(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.status === 404
          ? `Projekt mit ID ${id} wurde nicht gefunden.`
          : 'Projekt konnte nicht geladen werden. Läuft das Backend auf http://localhost:3000?');
        this.loading.set(false);
      },
    });
  }
}
