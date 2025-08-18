import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { apiUrl } from '../../../../core/services/api.config';

interface Badge {
  badgeId: number;
  typeBadge: string;
  description: string;
  seuilRequis: number;
  contributionsValidees: number;
  contributionsRestantes: number;
  pourcentageProgression: number;
  coinRecompense: number;
  dejaObtenu: boolean;
  prochainBadge: boolean;
}

interface ProgressionResponse {
  contributeurId: number;
  contributeurNom: string;
  contributeurPrenom: string;
  totalContributionsValidees: number;
  totalBadgesObtenus: number;
  totalCoinsGagnes: number;
  prochainBadge: Badge;
  tousLesBadges: Badge[];
}


@Component({
  selector: 'app-recompense-badge',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recompense-badge.html',
  styleUrls: ['./recompense-badge.css']
})
export class RecompenseBadge implements OnInit {
  badges: Badge[] = [];
  earnedBadges: Badge[] = [];
  nextBadges: Badge[] = [];
  totalContributions: number = 0;


  constructor(
    private location: Location,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Initialisation du composant.
   * Charge les badges pour le contributeur avec l'ID 2.
   */
  ngOnInit(): void {
    this.loadBadges(2); // 🔹 Charger les badges pour le contributeur 2
  }

  /**
   * Retourne à la page précédente.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Charge les badges pour un contributeur spécifique.
   * @param contributeurId L'ID du contributeur pour lequel charger les badges.
   */
  loadBadges(contributeurId: number): void {
    this.http.get<ProgressionResponse>(`http://localhost:8080/api/v1/progression/contributeur/${contributeurId}`)
      .subscribe({
        next: (data) => {
          console.log('[API Response]', data);

          this.totalContributions = data.totalContributionsValidees;
          this.badges = data.tousLesBadges;

          // Séparer obtenus et prochains
          this.earnedBadges = this.badges.filter(b => b.dejaObtenu || b.pourcentageProgression === 100);
          this.nextBadges = this.badges.filter(b => !b.dejaObtenu);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[Erreur API]', err);
        }
      });
  }

  /**
   * Obtient le badge précédent pour un badge donné.
   * @param badge Le badge actuel.
   * @returns Le badge précédent ou undefined si aucun n'existe.
   */
  getBadgeName(type: string): string {
    const nameMap: Record<string, string> = {
      'DEBUTANT': 'Débutant',
      'BRONZE': 'Bronze',
      'ARGENT': 'Argent',
      'OR': 'Or',
      'PLATINE': 'Platine'
    };
    return nameMap[type] ?? type;
  }

  /**
   * Obtient l'image associée à un type de badge.
   * Les images doivent être placées dans le dossier src/assets/images/badges.
   * @param type Le type de badge.
   * @returns
   */
  getBadgeImage(type: string): string {
    const imageMap: Record<string, string> = {
      'DEBUTANT': 'debutant.jpg',
      'BRONZE': 'BadgeBronze.png',
      'ARGENT': 'BadgeArgent.png',
      'OR': 'BadgeOr.png',
      'PLATINE': 'platine.png'
    };
    return imageMap[type] ?? 'default.png';
  }

  getProgressPercentage(badge: Badge): number {
    return badge.pourcentageProgression;
  }

  getContributionText(badge: Badge): string {
    return badge.contributionsRestantes > 0
      ? `${badge.contributionsRestantes} contribution(s) restante(s)`
      : 'Completé';
  }
}
