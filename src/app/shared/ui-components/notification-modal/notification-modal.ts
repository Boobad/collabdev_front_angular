import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './notification-modal.html',
  styleUrl: './notification-modal.css'
})
export class NotificationModal implements OnInit {
  @Output() close = new EventEmitter<void>();

  notifications: any[] = [];
  isLoading = false;
  errorMessage = '';
  userId = 0;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.loadNotifications();
  }

  /** 🔹 Récupération de l'ID utilisateur depuis le localStorage */
  getUserId(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.userId = JSON.parse(userStr).id;
      } catch (e) {
        console.error('Erreur parsing user:', e);
      }
    }
  }

  /** 🔹 Charger toutes les notifications non lues */
 loadNotifications(): void {
  if (!this.userId) {
    this.errorMessage = 'Utilisateur non identifié';
    this.cdRef.detectChanges();
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.http.get<any[]>(`http://localhost:8080/api/v1/notifications/utilisateur/${this.userId}/unread`)
    .subscribe({
      next: (data) => {
        // Assurez-vous que chaque notification a un type valide
        this.notifications = data.map(notif => ({
          ...notif,
          type: notif.type || 'info' // Valeur par défaut si type est undefined
        }));
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement notifications:', err);
        this.errorMessage = 'Impossible de charger les notifications';
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
}

  /** 🔹 Marquer une notification comme lue */
  markAsRead(notificationId: number): void {
    this.http.put(`http://localhost:8080/api/v1/notifications/${notificationId}/read`, {})
      .subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors du marquage comme lue:', err);
        }
      });
  }

  /** 🔹 Marquer toutes les notifications comme lues */
  markAllAsRead(): void {
    this.http.put(`http://localhost:8080/api/v1/notifications/utilisateur/${this.userId}/read-all`, {})
      .subscribe({
        next: () => {
          this.notifications = [];
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors du marquage de toutes comme lues:', err);
        }
      });
  }

  /** 🔹 Fermer le modal */
  closeNotification() {
    this.close.emit();
  }

  /** 🔹 Obtenir l'icône appropriée selon le type de notification */
 getNotificationIcon(type?: string): string {
  const iconMap: {[key: string]: string} = {
    'alert': 'fas fa-exclamation-circle',
    'warning': 'fas fa-exclamation-triangle',
    'info': 'fas fa-info-circle',
    'success': 'fas fa-check-circle',
    'error': 'fas fa-times-circle',
    'default': 'fas fa-bell'
  };
  
  // Si type est undefined, null ou vide, retourner l'icône par défaut
  if (!type) {
    return iconMap['default'];
  }
  
  // Retourner l'icône correspondante ou l'icône par défaut
  return iconMap[type.toLowerCase()] || iconMap['default'];
}
}