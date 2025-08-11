import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoinsService, ContributorResponse } from '../../core/coins-service';
import { BadgeexpTotal, HistoriqueResponse } from '../../core/badgeexp-total';
import { debounceTime, Subject } from 'rxjs';
import { NotificationModal } from '../ui-components/notification-modal/notification-modal';
import { ModalCreateProject } from '../ui-components/modal-create-project/modal-create-project';

@Component({
  selector: 'app-navebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ModalCreateProject, NotificationModal],
  templateUrl: './navebar.html',
  styleUrls: ['./navebar.css']
})
export class Navebar implements OnInit {
  showNotifications = false;
  coinsValue: number = 0;
  experiencePoints: number = 0;
  badgesCount: number = 0;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private coinsService: CoinsService,
    private participantService: BadgeexpTotal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContributorData();
    this.loadBadgesCount();
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.goToSearchPage();
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  goToSearchPage() {
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery.trim() || null },
      queryParamsHandling: 'merge'
    });
  }

  loadContributorData(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('Utilisateur non connecté ou info utilisateur non trouvée');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const userId = user.id;
      if (!userId) {
        console.error('User ID introuvable dans les données utilisateur');
        return;
      }
      this.coinsService.getContributorByUserId(userId).subscribe({
        next: (data: ContributorResponse) => {
          this.coinsValue = data.totalCoin;
          this.coinsService.setCoinsValue(this.coinsValue);
          this.experiencePoints = data.pointExp;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur récupération données contributeur :', error);
        }
      });
    } catch (e) {
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
      const userId = user.id;
      if (!userId) {
        console.error('User ID introuvable dans les données utilisateur');
        return;
      }
      this.participantService.getHistoriqueByParticipantId(userId).subscribe({
        next: (data: HistoriqueResponse) => {
          this.badgesCount = data.badgesAcquis.length;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur récupération historique badges :', error);
        }
      });
    } catch (e) {
      console.error('Erreur parsing user data:', e);
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.add('active'); // Ajoute .active
    }
  }
}