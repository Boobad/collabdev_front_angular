import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeService } from '../../../../core/badge-service';

export interface Badge {
  id: number;
  nom: string;
  image: string;
  description: string;
  nombreUtilisateurs: number;
  dateObtention: string; // format ISO: "YYYY-MM-DD"
}

// export interface BadgeForm {
//   nom: string;
//   image: string;
//   description: string;
//   nombreUtilisateurs: number;
//   dateObtention: string; // format: 'YYYY-MM-DD'
// }


@Component({
  selector: 'app-admin-badge',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './admin-badge.html',
  styleUrls: ['./admin-badge.css']
})
export class AdminBadge {

  badges: Badge[] = [];

   constructor(private badgeService: BadgeService) {}

 ngOnInit(): void {
    this.badgeService.getBadges().subscribe({
      next: (data) => {
        this.badges = data.map(b => ({
          id: b.id,
          nom: b.type, // on mappe 'type' de l'API vers 'nom' local
          image: 'assets/badges/' + b.type.toLowerCase() + '.png', // image fictive
          description: b.description,
          nombreUtilisateurs: b.nombreContribution,
          dateObtention: new Date().toISOString().split('T')[0] // valeur temporaire
        }));
      },
      error: (err) => console.error('Erreur de récupération des badges', err)
    });
  }



  editBadge(badge: Badge) {
    console.log('Éditer badge', badge);
  }

  deleteBadge(badge: Badge) {
    console.log('Supprimer badge', badge);
  }
}
