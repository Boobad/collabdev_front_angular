import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css']
})
export class ForgetPassword {
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre adresse email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post('http://localhost:8080/api/v1/auth/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Un email de réinitialisation a été envoyé si ce compte existe';
          setTimeout(() => {
            this.router.navigate(['/reset']);
          }, 3000);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Un email de réinitialisation a été envoyé si ce compte existe';
        }
      });
  }
}
