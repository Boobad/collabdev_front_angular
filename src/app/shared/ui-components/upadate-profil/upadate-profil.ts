import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-upadate-profil',
  imports: [],
  templateUrl: './upadate-profil.html',
  styleUrl: './upadate-profil.css'
})
export class UpadateProfil {

constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.location.back(); // Retour à la page précédente
  }

  saveProfile(): void {
    // Logique de sauvegarde ici
    console.log('Profil sauvegardé');
    this.router.navigate(['/profil']); // Redirection après sauvegarde
  }
}
