import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { apiUrl } from '../../../../core/services/api.config';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css']
})
export class ForgetPassword {
  email: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre adresse email';
      this.cdRef.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdRef.detectChanges();

    this.http.get<{ id: number; email: string }[]>(apiUrl(`/auth/users`))
      .subscribe({
        next: (users) => {
          const user = users.find(u => u.email.toLowerCase() === this.email.toLowerCase());
          this.isLoading = false;

          if (user) {
            this.successMessage = 'Email trouvé, redirection vers la page de réinitialisation...';
            this.errorMessage = '';
            this.cdRef.detectChanges();

            this.router.navigate(['/reset'], { queryParams: { id: user.id } });
          } else {
            this.errorMessage = 'Cet email n’existe pas dans notre base.';
            this.successMessage = '';
            this.cdRef.detectChanges();
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Erreur serveur lors de la vérification de l’email.';
          this.successMessage = '';
          this.cdRef.detectChanges();
        }
      });
  }
}
