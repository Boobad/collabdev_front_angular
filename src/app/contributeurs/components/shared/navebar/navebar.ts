import { Component } from '@angular/core';
import { ModalCreateProject } from '../../ui/modal-create-project/modal-create-project';
import { NotificationModal } from '../../ui/notification-modal/notification-modal';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navebar',
  imports: [ModalCreateProject,NotificationModal, CommonModule,RouterLink],
  templateUrl: './navebar.html',
  styleUrls: ['./navebar.css']
})
export class Navebar {
showNotifications = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

 openModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.add('active'); // Ajoute .active
    }
  }

  closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.remove('active'); // Enlève .active
    }
  }
}
