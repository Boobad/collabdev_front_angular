import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoinsService, ContributorResponse } from '../../core/coins-service';
import { BadgeexpTotal, HistoriqueResponse } from '../../core/badgeexp-total';
import { debounceTime, Subject } from 'rxjs';
import { NotificationModal } from '../ui-components/notification-modal/notification-modal';
import { ModalCreateProject } from '../ui-components/modal-create-project/modal-create-project';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ModalCreateProject, NotificationModal, HttpClientModule],
  templateUrl: './navebar.html',
  styleUrls: ['./navebar.css']
})
export class Navebar implements OnInit {
  showNotifications = false;
  coinsValue: number = 0;
  experiencePoints: number = 0;
  badgesCount: number = 0;
  notificationCount: number = 0; // 🔹 Nouveau : compteur notifications
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private userId: number = 0;

  constructor(
    private router: Router,
    private coinsService: CoinsService,
    private participantService: BadgeexpTotal,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.loadContributorData();
    this.loadBadgesCount();
    this.loadNotificationCount();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.goToSearchPage();
    });

    // 🔹 Optionnel : actualiser le compteur toutes les 30s
    setInterval(() => this.loadNotificationCount(), 30000);
  }

  /** 🔹 Récupérer ID utilisateur depuis localStorage */
  getUserId(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      this.userId = user.id;
    } catch (e) {
      console.error('Erreur parsing user data:', e);
    }
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
    if (!this.userId) return;
    this.coinsService.getContributorByUserId(this.userId).subscribe({
      next: (data: ContributorResponse) => {
        this.coinsValue = data.totalCoin;
        this.coinsService.setCoinsValue(this.coinsValue);
        this.experiencePoints = data.pointExp;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Erreur récupération données contributeur :', error)
    });
  }

  loadBadgesCount(): void {
    if (!this.userId) return;
    this.participantService.getHistoriqueByParticipantId(this.userId).subscribe({
      next: (data: HistoriqueResponse) => {
        this.badgesCount = data.badgesAcquis.length;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Erreur récupération historique badges :', error)
    });
  }

  /** 🔹 Charger le compteur de notifications non lues */
  loadNotificationCount(): void {
    if (!this.userId) return;
    this.http.get<{ count: number }>(`http://localhost:8080/api/v1/notifications/utilisateur/${this.userId}/unread/count`)
      .subscribe({
        next: (res) => {
          this.notificationCount = res.count;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur récupération compteur notifications:', err)
      });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) return;
    // Quand on ouvre le modal, on peut recharger le compteur
    this.loadNotificationCount();
  }

  openModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.add('active');
  }
}
