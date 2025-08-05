import { Component } from '@angular/core';

@Component({
  selector: 'app-banniere',
  imports: [],
  templateUrl: './banniere.html',
  styleUrl: './banniere.css'
})
export class Banniere {
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
