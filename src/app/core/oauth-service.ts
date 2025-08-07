import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  constructor(private oauthService: OAuthService, private router: Router) {}

  loginWithGoogle() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin + '/oauth2-redirect',
      clientId: '312043062222-pqt5dp0nerpmuan5n774068e6ps64um8.apps.googleusercontent.com',
      scope: 'openid profile email',
      responseType: 'code', // ✅ Utiliser Authorization Code Flow avec PKCE
      strictDiscoveryDocumentValidation: false,
      showDebugInformation: true
    };

    this.oauthService.configure(config);

    this.oauthService.loadDiscoveryDocumentAndLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const token = this.oauthService.getAccessToken();
        console.log("Token Google :", token);
        // 👉 Envoyer ce token au backend pour échanger contre un token interne ou créer une session
      }
    });
  }

  logout() {
    this.oauthService.logOut();
  }
}
