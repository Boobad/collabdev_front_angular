import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-card-badges',
  standalone: true, // Assure-toi que standalone est présent
  imports: [CommonModule],
  templateUrl: './card-badges.html',
  styleUrls: ['./card-badges.css']
})
export class CardBadges {
 badges = [
    {
      title: 'Badges Récents',
      description: 'Voici les badges que vous avez récemment obtenus.',
      color: 'yellow'
    },
    {
      title: 'Top Contributeur',
      description: 'Vous avez contribué plus que 90% des utilisateurs.',
      color: 'lightgreen'
    },
    {
      title: 'Nouveau Membre',
      description: 'Bienvenue dans la communauté !',
      color: 'lightblue'
    }
  ];
}
