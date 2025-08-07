import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-oauth2-redirect',
  imports: [],
  templateUrl: './oauth2-redirect.html',
  styleUrl: './oauth2-redirect.css'
})
export class Oauth2RedirectComponent implements OnInit {
  constructor(private oauthService: OAuthService) {}

  ngOnInit(): void {
    this.oauthService.tryLogin();
  }
}
