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
  participants: any[] = [];
  gestionnaires: any[] = [];
  developpeurs: any[] = [];
  designers: any[] = [];
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
      if (projectId) {
        this.loadProject(projectId);
        this.loadParticipants(projectId);
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

    this.projectsService.get(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement projet:', err);
        this.error = true;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadParticipants(id: string): void {
    this.projectsService.getParticipants(id).subscribe({
      next: (participants: any[]) => {
        this.participants = participants;
        this.gestionnaires = participants.filter(p => p.profil === 'GESTIONNAIRE');
        this.developpeurs = participants.filter(p => p.profil === 'DEVELOPPEUR');
        this.designers = participants.filter(p => p.profil === 'DESIGNER');
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur chargement participants:', err)
    });
  }
}
