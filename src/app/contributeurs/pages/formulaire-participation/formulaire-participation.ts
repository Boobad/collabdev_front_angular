import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulaire-participation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formulaire-participation.html',
  styleUrls: ['./formulaire-participation.css'],
})
export class FormulaireParticipation {
  formData = {
    fullname: '',
    email: '',
    portfolio: '',
    role: '',
    motivation: '',
    experience: '',
  };

  motivationMessage: string = '200 caractères restants (min. 200)';

  constructor(private router: Router) {}

  selectRole(role: string) {
    this.formData.role = role;
  }

  updateMotivationCount() {
    const count = this.formData.motivation.length;
    const min = 200;
    if (count < min) {
      this.motivationMessage = `${
        min - count
      } caractères restants (min. ${min})`;
    } else {
      this.motivationMessage = 'Motivation suffisante';
    }
  }

  onSubmit() {
    if (!this.formData.role) {
      alert('Veuillez sélectionner un rôle');
      return;
    }

    if (this.formData.motivation.length < 200) {
      alert('Veuillez décrire vos motivations en au moins 200 caractères');
      return;
    }

    // Redirection vers la page demarrage-quiz (avec ou sans paramètres selon besoin)
    this.router.navigate(['/demarrage-quiz'], {
      queryParams: { role: this.formData.role, email: this.formData.email },
    });
  }
}
