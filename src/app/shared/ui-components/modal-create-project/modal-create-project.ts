import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-create-project',
  templateUrl: './modal-create-project.html',
  styleUrls: ['./modal-create-project.css']
})
export class ModalCreateProject {

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
