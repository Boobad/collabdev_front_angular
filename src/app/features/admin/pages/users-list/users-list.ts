import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.css']
})
export class UsersList implements OnInit {
  users = [
    {
      id: 1,
      name: 'Boubou nunu',
      role: 'Administrateur',
      status: 'active',
      avatar: 'BT',
      contributions: 42,
      coins: 280,
      projects: 5,
      blocked: false
    },
    {
      id: 2,
      name: 'Moh nunu',
      role: 'Contributeur',
      status: 'active',
      avatar: 'M',
      contributions: 28,
      coins: 185,
      projects: 3,
      blocked: false
    },
    {
      id: 3,
      name: 'simpo nunu',
      role: 'Contributeur',
      status: 'inactive',
      avatar: 'SN',
      contributions: 15,
      coins: 120,
      projects: 2,
      blocked: false
    },
    {
      id: 4,
      name: 'SD nun',
      role: 'Contributeur',
      status: 'active',
      avatar: 'SD',
      contributions: 32,
      coins: 210,
      projects: 4,
      blocked: false
    }
  ];
  currentDeletingUser: number | null = null;
  notification: { message: string; type: string; show: boolean } | null = null;

  get notificationClasses(): { [key: string]: boolean } {
    return this.notification ? {
      'show': this.notification.show,
      'notification': true,
      [this.notification.type]: true
    } : {};
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.renderUsers();
  }

  renderUsers() {
    // La mise à jour sera gérée par le template Angular
  }

  deleteUser(userId: number) {
    this.currentDeletingUser = userId;
    this.openModal('deleteModal');
  }

  confirmDelete() {
    if (this.currentDeletingUser !== null) {
      this.users = this.users.filter(u => u.id !== this.currentDeletingUser);
      this.renderUsers();
      this.closeModal('deleteModal');
      this.showNotification('Utilisateur supprimé avec succès', 'success');
      this.currentDeletingUser = null;
    }
  }

  toggleBlockUser(userId: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.blocked = !user.blocked;
      this.renderUsers();
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
      }, 300); // Temps pour l'animation de disparition
    }, 3000); // Affichage pendant 3 secondes
  }
}