import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth-service';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
   
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    this.initializeGoogleSignIn();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '425444552086-3pd70ibsfafbg9gg4rc1s0iqngtadndf.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleResponse(response),
      });
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large' }
      );
    } else {
      console.warn('Google API not loaded');
    }
  }

  handleGoogleResponse(response: any): void {
    if (!response?.credential) {
      console.error('Invalid Google response');
      return;
    }

    this.isLoading = true;
    this.authService.loginWithGoogleToken(response.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.handleLoginSuccess(res);
        },
        error: (err) => {
          this.handleLoginError('Connexion Google échouée', err);
        }
      });
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading = true;
    const credentials = {
      email: this.username,
      password: this.password
    };

    this.authService.loginUser(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (err) => {
          this.handleLoginError('Email ou mot de passe incorrect', err);
        }
      });
  }

  // loginWithGithub(): void {
  //   this.isLoading = true;
  //   // Utilisez le service OAuth plutôt qu'une redirection directe
  //   this.oauthService.initiateGithubLogin()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (url) => {
  //         window.location.href = url || 'http://localhost:8080/oauth2/authorization/github';
  //       },
  //       error: (err) => {
  //         this.handleLoginError('Connexion GitHub échouée', err);
  //       }
  //     });
  // }

  // loginWithLinkedin(): void {
  //   this.isLoading = true;
  //   this.oauthService.initiateLinkedinLogin()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (url) => {
  //         window.location.href = url || 'http://localhost:8080/oauth2/authorization/linkedin';
  //       },
  //       error: (err) => {
  //         this.handleLoginError('Connexion LinkedIn échouée', err);
  //       }
  //     });
  // }

  private handleLoginSuccess(response: any): void {
    this.authService.saveToken(response.token);
    if (this.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    this.router.navigate(['/home']);
    this.isLoading = false;
  }

  private handleLoginError(message: string, error: any): void {
    console.error(message, error);
    alert(message);
    this.isLoading = false;
  }
}
