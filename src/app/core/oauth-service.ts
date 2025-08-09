import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  constructor(private oauthService: OAuthService, private router: Router) {}

  

 
 
  logout() {
    this.oauthService.logOut();
  }
}
