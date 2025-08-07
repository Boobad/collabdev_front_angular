import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth-service';
import { OauthService } from '../../../../core/oauth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private oauthService: OauthService,
    private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(): void {
    // Simule la connexion
    if (this.username === 'test@example.com' && this.password === '123456') {
      this.authService.login('fake-token');
      this.router.navigate(['/home']);
    } else {
      alert('Email ou mot de passe incorrect');
    }
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
