import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { apiUrl } from '../../../../core/services/api.config';

interface Badge {
  type: string;
  nombreContribution: number;
  coinRecompense: number;
  description: string;
  atteint: boolean;
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
  totalContributions: number = 1; // À remplacer par la valeur réelle de l'API

  constructor(private location: Location, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('[ngOnInit] Initialisation du composant...');
    this.loadBadges();
  }

  goBack(): void {
    this.location.back(); // 🔹 Retour à la page précédente
  }
  
  loadBadges(): void {
    console.log('[loadBadges] Chargement des badges...');
    this.http.get<Badge[]>(apiUrl(`/participants/1/badges/progression`)).subscribe({
      next: (data) => {
        console.log('[loadBadges] Réponse API reçue :', data);

        this.badges = data;
        this.earnedBadges = data.filter(badge => badge.atteint);
        this.nextBadges = data.filter(badge => !badge.atteint);

        console.log('[loadBadges] Badges obtenus :', this.earnedBadges);
        console.log('[loadBadges] Badges suivants :', this.nextBadges);

        // Trouver le nombre total de contributions (pour la progression)
        const lastEarned = this.earnedBadges[this.earnedBadges.length - 1];
        this.totalContributions = lastEarned ? lastEarned.nombreContribution : 0;

        console.log('[loadBadges] Total contributions détecté :', this.totalContributions);

        // Forcer Angular à détecter le changement après la mise à jour des données
        this.cdr.detectChanges();
        console.log('[loadBadges] Changement détecté.');
      },
      error: (err) => {
        console.error('[loadBadges] Erreur lors du chargement des badges', err);
      }
    });
  }

  getBadgeName(type: string): string {
    const nameMap: Record<string, string> = {
      'DEBUTANT': 'Débutant',
      'BRONZE': 'Bronze',
      'ARGENT': 'Argent',
      'OR': 'Or',
      'PLATINE': 'Platine'
    };
    const result = nameMap[type] ?? type;
    console.log(`[getBadgeName] Type: ${type} => Nom: ${result}`);
    return result;
  }

  getBadgeImage(type: string): string {
    const imageMap: Record<string, string> = {
      'DEBUTANT': 'debutant.jpg',
      'BRONZE': 'BadgeBronze.png',
      'ARGENT': 'BadgeArgent.png',
      'OR': 'BadgeOr.png',
      'PLATINE': 'platine.png'
    };
    const result = imageMap[type] ?? 'default.png';
    console.log(`[getBadgeImage] Type: ${type} => Image: ${result}`);
    return result;
  }

  getProgressPercentage(badge: Badge): number {
    if (this.totalContributions >= badge.nombreContribution) return 100;

    const previousBadge = this.getPreviousBadge(badge);
    const min = previousBadge ? previousBadge.nombreContribution : 0;
    const max = badge.nombreContribution;
    const progress = Math.round(((this.totalContributions - min) / (max - min)) * 100);

    console.log(`[getProgressPercentage] Badge: ${badge.type}, Progression: ${progress}%`);
    return progress;
  }

  getContributionText(badge: Badge): string {
    const remaining = badge.nombreContribution - this.totalContributions;
    const result = remaining > 0
      ? `${remaining} contribution${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`
      : 'Completé';
    console.log(`[getContributionText] Badge: ${badge.type}, Texte: ${result}`);
    return result;
  }

  private getPreviousBadge(badge: Badge): Badge | null {
    const index = this.badges.findIndex(b => b.type === badge.type);
    const result = index > 0 ? this.badges[index - 1] : null;
    console.log(`[getPreviousBadge] Badge: ${badge.type}, Précédent:`, result);
    return result;
  }
}
