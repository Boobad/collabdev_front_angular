import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalCreateProject } from '../ui-components/modal-create-project/modal-create-project';
import { NotificationModal } from '../ui-components/notification-modal/notification-modal';
import { CoinsService, ContributorResponse } from '../../core/coins-service';
import { BadgeexpTotal, HistoriqueResponse } from '../../core/badgeexp-total';

@Component({
  selector: 'app-navebar',
  standalone: true,
  imports: [ModalCreateProject, NotificationModal, CommonModule, RouterLink],
  templateUrl: './navebar.html',
  styleUrls: ['./navebar.css']
})
export class Navebar implements OnInit {
  showNotifications = false;
  coinsValue: number = 0;
  experiencePoints: number = 0;
  badgesCount: number = 0;

  constructor(
    private coinsService: CoinsService,
    private participantService: BadgeexpTotal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContributorData();
    this.loadBadgesCount();
  }

  loadContributorData(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('Utilisateur non connecté ou info utilisateur non trouvée');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      console.log('Utilisateur localStorage:', user);
      const userId = user.id;
      if (!userId) {
        console.error('User ID introuvable dans les données utilisateur');
        return;
      }
      this.coinsService.getContributorByUserId(userId).subscribe({
        next: (data: ContributorResponse) => {
          console.log('Données contributeur reçues:', data);
          this.coinsValue = data.totalCoin;
          this.experiencePoints = data.pointExp;
          this.cdr.detectChanges(); // Forcer détection changement si besoin
        },
        error: (error) => {
          console.error('Erreur récupération données contributeur :', error);
        }
      });
    } catch(e) {
      console.error('Erreur parsing user data:', e);
    }
  }

  loadBadgesCount(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('Utilisateur non connecté ou info utilisateur non trouvée');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      console.log('Utilisateur localStorage pour badges:', user);
      const userId = user.id;
      if (!userId) {
        console.error('User ID introuvable dans les données utilisateur');
        return;
      }
      this.participantService.getHistoriqueByParticipantId(userId).subscribe({
        next: (data: HistoriqueResponse) => {
          console.log('Historique badges reçu:', data);
          this.badgesCount = data.badgesAcquis.length;
          this.cdr.detectChanges(); // Forcer détection changement si besoin
        },
        error: (error: any) => {
          console.error('Erreur récupération historique badges :', error);
        }
      });
    } catch(e) {
      console.error('Erreur parsing user data:', e);
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.add('active');
  }

  closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  }
}
