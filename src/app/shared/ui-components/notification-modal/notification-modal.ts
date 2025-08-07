import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-notification-modal',
  imports: [CommonModule],
  templateUrl: './notification-modal.html',
  styleUrl: './notification-modal.css'
})
export class NotificationModal {
 @Output() close = new EventEmitter<void>();

  closeNotification() {
    this.close.emit(); // Émet l’événement vers le parent
  }
}
