import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-suscribe',
  standalone: true, // Ajoutez cette ligne
  imports: [FormsModule,CommonModule],
  templateUrl: './form-suscribe.html',
  styleUrl: './form-suscribe.css'
})
export class FormSuscribe {
 showModals = false;

  togglesModal() {
    this.showModals = !this.showModals;
  }
}
