import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

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
  exigences?: string; // ajouté pour la modal
}

export interface Participant {
  id: number;
  profil: string;
  statut: string;
  scoreQuiz: string;
  estDebloque: boolean;
  contributeurNom: string;
  contributeurPrenom: string;
  contributeurEmail: string;
  projetTitre: string;
}

@Component({
  selector: 'app-mes-card-project',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule],
  templateUrl: './mes-card-project.html',
  styleUrls: ['./mes-card-project.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms var(--modal-transition)', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms var(--modal-transition)', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms var(--modal-transition)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms var(--modal-transition)', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ])
  ]
})
export class MesCardProject implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  participants: { [projectId: number]: Participant[] } = {};
  selectedProject: Project | null = null; // pour modal
  isLoading = false;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  getDomainColor(domain?: string): string {
    const colors: {[key: string]: string} = {
      'web': '#1565C0',
      'mobile': '#7B1FA2',
      'santé': '#C62828',
      'finance': '#2E7D32',
      'cybersécurité': '#0277BD',
      'default': '#3f51b5'
    };
    return colors[domain?.toLowerCase() || 'default'];
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
          project => project.status?.trim().toUpperCase() === 'OUVERT'
        );

        this.filteredProjects.forEach(project => this.fetchParticipants(project.id));

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

  fetchParticipants(projectId: number): void {
    this.http.get<Participant[]>(`http://localhost:8080/api/v1/participants/projet/${projectId}`)
      .subscribe({
        next: data => {
          this.participants[projectId] = data;
          this.cdRef.detectChanges();
        },
        error: err => console.error(`Erreur chargement participants du projet ${projectId}:`, err)
      });
  }

  isUserParticipant(projectId: number): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;

    const userEmail = JSON.parse(userStr).email;
    return (this.participants[projectId] || []).some(p => p.contributeurEmail === userEmail);
  }

  goToProject(project: Project): void {
    if (this.isUserParticipant(project.id)) {
      this.router.navigate(['/details', project.id]);
    } else {
      this.selectedProject = project; // ouvrir modal si non participant
    }
  }

  closeModal(): void {
    this.selectedProject = null;
  }

  getDomainClass(domain?: string): string {
    if (!domain) return 'default';
    const domainMap: { [key: string]: string } = {
      'web': 'web',
      'mobile': 'mobile',
      'santé': 'sante',
      'finance': 'finance',
      'cybersécurité': 'cybersecurite'
    };
    return domainMap[domain.toLowerCase()] || 'default';
  }

  toCssClass(value?: string): string {
    if (!value) return 'default';
    return value.trim().toLowerCase().replace(/ /g, '-');
  }
}
