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
import { apiUrl } from '../../../core/services/api.config';

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

  private getUserEmail(): string | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).email : null;
  }

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

  fetchProjects(): void {
    this.isLoading = true;
    this.error = null;
    this.cdRef.detectChanges();

    this.http.get<Project[]>(apiUrl(`/projets`))
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

          this.filteredProjects = this.projects.filter(project => {
  const status = project.status?.trim()?.toUpperCase();
  return status === 'OUVERT' || status === 'EN_COURS';
});

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

  fetchParticipants(projectId: number): void {
    this.http.get<Participant[]>(apiUrl(`/participants/projet/${projectId}`))
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

  isUserAcceptedParticipant(projectId: number): boolean {
    const email = this.getUserEmail();
    if (!email) return false;

    return (this.participants[projectId] || []).some(
      p => p.contributeurEmail === email && p.statut?.trim()?.toUpperCase() === 'ACCEPTE'
    );
  }

  isUserPendingParticipant(projectId: number): boolean {
    const email = this.getUserEmail();
    if (!email) return false;

    return (this.participants[projectId] || []).some(
      p => p.contributeurEmail === email && p.statut?.trim()?.toUpperCase() !== 'ACCEPTE'
    );
  }

onProjectButtonClick(projectId: number, requiredCoins: number): void {
  const participant = (this.participants[projectId] || []).find(
    p => p.contributeurEmail === this.getUserEmail()
  );

  if (participant) {
    if (participant.statut?.trim().toUpperCase() !== 'ACCEPTE') {
      alert('Votre demande est en attente de validation.');
      return;
    }

    if (!participant.estDebloque) {
      this.unlockProject(projectId);
    } else {
      this.router.navigate(['/details', projectId]);
    }
  } else {
    // Utilisateur pas encore participant → vérifier les coins
    if (this.userCoins >= requiredCoins) {
      this.router.navigate(['/formulaire-participation', projectId]);
    } else {
      this.openInsufficientCoinsModal(requiredCoins);
    }
  }
}

getProjectButtonLabel(projectId: number, requiredCoins: number): string {
  const participant = (this.participants[projectId] || []).find(
    p => p.contributeurEmail === this.getUserEmail()
  );

  if (!participant) return this.userCoins >= requiredCoins ? 'Rejoindre le projet' : 'Coins insuffisants';
  if (participant.statut?.trim().toUpperCase() !== 'ACCEPTE') return 'Demande en attente';
  return participant.estDebloque ? 'Accéder au projet' : 'Débloquer le projet';
}




  unlockProject(projectId: number): void {
    const participant = (this.participants[projectId] || []).find(
      p => p.contributeurEmail === this.getUserEmail()
    );
    if (!participant) return;

    const participantId = participant.id;
    console.log('ID du participant à débloquer:', participantId);

    this.http.patch(apiUrl(`/participants/${participantId}/projet/${projectId}/unlock`), {})
      .subscribe({
        next: () => {
          console.log(`Projet ${projectId} débloqué pour le participant ${participantId}`);
          participant.estDebloque = true;  // Met à jour localement
          this.loadUserCoins();            // Recharge les coins
        },
        error: (err) => {
          console.error('Erreur déblocage projet:', err);
          alert('Impossible de débloquer le projet. Vérifiez vos coins.');
        }
      });
  }

  openInsufficientCoinsModal(requiredCoins: number): void {
    this.dialog.open(AppInsufficientCoinsDialog, {
      width: '300px',
      data: { requiredCoins, userCoins: this.userCoins }
    });
  }

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
