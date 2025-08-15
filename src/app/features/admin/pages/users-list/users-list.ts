import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from '../../../../core/users-service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.css']
})
export class UsersList implements OnInit {
  users: any[] = [];
  loading = true;
  currentDeletingUser: number | null = null;
  notification: { message: string; type: string; show: boolean } | null = null;

  get notificationClasses(): { [key: string]: boolean } {
    return this.notification ? {
      'show': this.notification.show,
      'notification': true,
      [this.notification.type]: true
    } : {};
  }

  constructor(private router: Router, private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsersProgressively();
  }

  loadUsersProgressively() {
    // Charger les contributeurs en premier
    this.usersService.getContributeurs().subscribe({
      next: contributeurs => {
        this.users.push(...contributeurs.map(c => ({
          id: c.id,
          name: `${c.nom} ${c.prenom}`,
          role: 'Contributeur',
          status: c.actif ? 'active' : 'inactive',
          avatar: this.getAvatarInitials(c.nom, c.prenom),
          contributions: c.pointExp,
          coins: c.totalCoin,
          projects: 0,
          blocked: !c.actif
        })));
        this.loading = false; // on a déjà quelque chose à afficher
      },
      error: err => {
        this.showNotification('Erreur chargement contributeurs', 'error');
        console.error(err);
      }
    });

    // Charger les administrateurs ensuite
    this.usersService.getAdmins().subscribe({
      next: admins => {
        this.users.push(...admins.map(a => ({
          id: a.id,
          name: a.email,
          role: 'Administrateur',
          status: a.actif ? 'active' : 'inactive',
          avatar: this.getAvatarInitials(a.email),
          contributions: 0,
          coins: 0,
          projects: 0,
          blocked: !a.actif
        })));
      },
      error: err => {
        this.showNotification('Erreur chargement administrateurs', 'error');
        console.error(err);
      }
    });
  }

  getAvatarInitials(nom: string, prenom?: string): string {
    if (prenom) return `${nom[0]}${prenom[0]}`.toUpperCase();
    return nom[0]?.toUpperCase() || '?';
  }

  deleteUser(userId: number) {
    this.currentDeletingUser = userId;
    this.openModal('deleteModal');
  }

  confirmDelete() {
    if (this.currentDeletingUser !== null) {
      this.users = this.users.filter(u => u.id !== this.currentDeletingUser);
      this.closeModal('deleteModal');
      this.showNotification('Utilisateur supprimé avec succès', 'success');
      this.currentDeletingUser = null;
    }
  }

  toggleBlockUser(userId: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.blocked = !user.blocked;
      const action = user.blocked ? 'bloqué' : 'débloqué';
      this.showNotification(`Utilisateur ${action} avec succès`, user.blocked ? 'warning' : 'success');
    }
  }

  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  showNotification(message: string, type: string = 'success') {
    this.notification = { message, type, show: true };
    setTimeout(() => {
      this.notification!.show = false;
      setTimeout(() => {
        this.notification = null;
      }, 300);
    }, 3000);
  }
}
