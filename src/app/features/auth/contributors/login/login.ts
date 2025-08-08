import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth-service';
import { OauthService } from '../../../../core/oauth-service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
   isLoading: boolean = false; // Ajoutez cette propriété

  constructor(
    private authService: AuthService,
    private oauthService: OauthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

   onLogin(): void {
    this.isLoading = true; // Active le loading

    const credentials = {
      email: this.username,
      password: this.password
    };

    this.authService.loginUser(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.authService.saveToken(response.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur de login :', err);
        alert('Email ou mot de passe incorrect');
        this.isLoading = false; // Désactive le loading en cas d'erreur
      },
      complete: () => {
        this.isLoading = false; // Désactive le loading quand l'opération est terminée
      }
    });
  }

  loginWithGoogle() {
    this.oauthService.loginWithGoogle();
  }

  loginWithGithub() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  }

  loginWithLinkedin() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/linkedin';
  }
}
