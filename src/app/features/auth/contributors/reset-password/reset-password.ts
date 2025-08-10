import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  // Méthodes pour la validation visuelle
  hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*]/.test(this.newPassword);
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.errorMessage = 'Le mot de passe doit contenir 8 caractères minimum avec au moins 1 chiffre et 1 caractère spécial';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('http://localhost:8080/api/v1/auth/reset-password', {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe réinitialisé avec succès !';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la réinitialisation';
        this.isLoading = false;
      }
    });
  }

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  }
}