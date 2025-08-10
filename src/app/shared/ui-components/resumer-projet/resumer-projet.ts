import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'app-resumer-projet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumer-projet.html',
  styleUrls: ['./resumer-projet.css']
})
export class ResumerProjet implements OnInit {
  project: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      console.log('Param id:', projectId);
      if (projectId) {
        this.loadProject(projectId);
      } else {
        this.error = true;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadProject(id: string): void {
    this.loading = true;
    this.error = false;
    this.project = null;
    this.cd.detectChanges();

    console.log('Chargement projet id:', id);

    this.projectsService.get(id).subscribe({
      next: (project) => {
        console.log('Projet reçu:', project);
        this.project = project;
        this.loading = false;
        this.cd.detectChanges();  // forcer la détection
      },
      error: (err) => {
        console.error('Erreur chargement projet:', err);
        this.error = true;
        this.loading = false;
        this.cd.detectChanges();  // forcer la détection
      }
    });
  }
}
