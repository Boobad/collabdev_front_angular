import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CoinsService } from '../../../core/coins-service';
import { AppInsufficientCoinsDialog } from '../app-insufficient-coins-dialog/app-insufficient-coins-dialog';

interface Project {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  secteur: string;
  status: string;
  niveau: string;
  dateCreation: string;
  coinsRequired?: number;
}

interface Participant {
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

interface ContributorResponse {
  totalCoin: number;
  pointExp: number;
}

@Component({
  selector: 'app-projects-recommander',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './projects-recommander.html',
  styleUrls: ['./projects-recommander.css']
})
export class ProjectsRecommander implements OnInit {
  userCoins: number = 0;
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  participants: { [projectId: number]: Participant[] } = {};
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private coinsService: CoinsService
  ) {}

  ngOnInit() {
    this.loadUserCoins();
  }

  // 🔹 Charger les coins de l'utilisateur
  loadUserCoins(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.error = 'Utilisateur non connecté';
      this.isLoading = false;
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const userId = user.id;

      if (!userId) {
        this.error = 'ID utilisateur introuvable';
        this.isLoading = false;
        return;
      }

      this.coinsService.getContributorByUserId(userId).subscribe({
        next: (data: ContributorResponse) => {
          this.userCoins = data.totalCoin;
          this.fetchProjects();
        },
        error: (err: any) => {
          console.error('Erreur récupération coins:', err);
          this.error = 'Erreur de chargement des coins';
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
    } catch (e) {
      console.error('Erreur parsing user data:', e);
      this.error = 'Données utilisateur invalides';
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  // 🔹 Charger tous les projets ouverts
  fetchProjects(): void {
    this.isLoading = true;
    this.error = null;
    this.cdRef.detectChanges();

    this.http.get<Project[]>('http://localhost:8080/api/v1/projets')
      .subscribe({
        next: (data) => {
          this.projects = data.map(project => {
            let coins = 0;
            switch (project.niveau?.trim()?.toLowerCase()) {
              case 'debutant': coins = 10; break;
              case 'intermediaire': coins = 20; break;
              case 'avance': coins = 40; break;
              case 'difficile': coins = 50; break;
              case 'expert': coins = 70; break;
              default: coins = 100;
            }
            return { ...project, coinsRequired: coins };
          });

          this.filteredProjects = this.projects.filter(
            project => project.status?.trim()?.toUpperCase() === 'OUVERT'
          );

          // 🔹 Charger les participants pour chaque projet
          this.filteredProjects.forEach(project => {
            this.fetchParticipants(project.id);
          });

          if (this.filteredProjects.length === 0) {
            this.error = 'Aucun projet en attente disponible';
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.error = 'Échec du chargement des projets';
          this.isLoading = false;
          this.cdRef.detectChanges();
          console.error('Erreur API:', err);
        }
      });
  }

  // 🔹 Charger les participants d'un projet
  fetchParticipants(projectId: number): void {
    this.http.get<Participant[]>(`http://localhost:8080/api/v1/participants/projet/${projectId}`)
      .subscribe({
        next: (data) => {
          this.participants[projectId] = data;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur récupération participants:', err);
        }
      });
  }

  // 🔹 Vérifier si l'utilisateur est participant
  isUserParticipant(projectId: number): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;

    const userEmail = JSON.parse(userStr).email;
    const participants: Participant[] = this.participants[projectId] || [];
    return participants.some(p => p.contributeurEmail === userEmail);
  }

  // 🔹 Rejoindre le projet ou accéder aux détails
  onJoinProject(projectId: number, requiredCoins: number): void {
    if (!this.isUserParticipant(projectId)) {
      if (this.userCoins >= requiredCoins) {
        this.router.navigate(['/formulaire-participation', projectId]);
      } else {
        this.openInsufficientCoinsModal(requiredCoins);
      }
    } else {
      this.router.navigate(['/details', projectId]);
    }
  }

  // 🔹 Modal d'insuffisance de coins
  openInsufficientCoinsModal(requiredCoins: number): void {
    this.dialog.open(AppInsufficientCoinsDialog, {
      width: '300px',
      data: {
        requiredCoins: requiredCoins,
        userCoins: this.userCoins
      }
    });
  }

  // 🔹 Définir la classe CSS selon le domaine
  getDomainClass(domaine: string): string {
    const domainMap: {[key: string]: string} = {
      'WEB': 'web',
      'MOBILE': 'mobile',
      'SANTE': 'sante',
      'FINANCE': 'finance',
      'CYBERSECURITE': 'cybersecurite'
    };
    return domainMap[domaine] || 'default';
  }
}
