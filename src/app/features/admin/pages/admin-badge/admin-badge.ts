import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

export interface Badge {
  id: number;
  nom: string;
  image: string;
  description: string;
  nombreUtilisateurs: number;
  dateObtention: string; // format ISO: "YYYY-MM-DD"
}

export interface BadgeForm {
  nom: string;
  image: string;
  description: string;
  nombreUtilisateurs: number;
  dateObtention: string; // format: 'YYYY-MM-DD'
}


@Component({
  selector: 'app-admin-badge',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './admin-badge.html',
  styleUrls: ['./admin-badge.css'] // ✅ tableau
})
export class AdminBadge {

  badges: Badge[] = [
    {
      id: 1,
      nom: 'Badge Bronze',
      image: 'BadgeBronze.png',
      description: 'Premiers pas sur la plateforme',
      nombreUtilisateurs: 1021,
      dateObtention: '2025-05-12'
    },
    {
      id: 2,
      nom: 'Badge Argent',
      image: 'BadgeArgent.png',
      description: 'Participation active',
      nombreUtilisateurs: 540,
      dateObtention: '2025-05-12'
    },
    {
      id: 3,
      nom: 'Badge Or',
      image: 'BadgeOr.png',
      description: 'Contribution exceptionnelle',
      nombreUtilisateurs: 210,
      dateObtention: '2025-05-12'
    }
  ];

  editBadge(badge: Badge) {
    console.log('Éditer badge', badge);
  }

  deleteBadge(badge: Badge) {
    console.log('Supprimer badge', badge);
  }
}
