import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

export interface Project {
  id: number;
  titre: string;
  description: string;
  domaine?: string;
  secteur?: string;
  status: string;
  niveau?: string;
  dateCreation?: string;
  coinsRequired?: number;
}

@Component({
  selector: 'app-mes-card-project',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: './mes-card-project.html',
  styleUrls: ['./mes-card-project.css']
})
export class MesCardProject implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Project[]>('http://localhost:8080/api/v1/projets').subscribe({
      next: (data: Project[]) => {
        this.projects = data.map(project => {
          let coins = 100;
          switch (project.niveau?.trim().toLowerCase()) {
            case 'debutant': coins = 10; break;
            case 'intermediaire': coins = 20; break;
            case 'avance': coins = 40; break;
            case 'difficile': coins = 50; break;
            case 'expert': coins = 70; break;
          }
          return { ...project, coinsRequired: coins };
        });

        this.filteredProjects = this.projects.filter(
          project => project.status?.trim().toUpperCase() === 'EN_ATTENTE'
        );

        if (this.filteredProjects.length === 0) {
          this.error = 'Aucun projet en attente disponible';
        }

        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Échec du chargement des projets';
        this.isLoading = false;
        this.cdRef.detectChanges();
        console.error('Erreur API:', err);
      }
    });
  }

  toCssClass(value?: string): string {
    if (!value) return 'default';
    return value.trim().toLowerCase().replace(/ /g, '-');
  }
}

