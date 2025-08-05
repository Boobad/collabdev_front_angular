import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-create-project',
  imports: [],
  templateUrl: './modal-create-project.html',
  styleUrl: './modal-create-project.css'
})
export class ModalCreateProject {
   openModal() {
    // Logic to open modal
    const modal = document.querySelector('#projectModal') as HTMLElement;
    if (modal !== null) {
      modal.classList.add('active');
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
    }
  }

  closeModal() {
    // Logic to close modal
    const modal = document.querySelector('#projectModal') as HTMLElement;
    if (modal !== null) {
      modal.classList.remove('active');
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
    }
  }
}
