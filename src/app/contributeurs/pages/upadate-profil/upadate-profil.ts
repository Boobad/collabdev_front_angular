import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upadate-profil',
  imports: [],
  templateUrl: './upadate-profil.html',
  styleUrl: './upadate-profil.css'
})
export class UpadateProfil {

constructor(private router: Router) {} 

  redirectToLogin() {
    this.router.navigate(['/']);
  }
}
