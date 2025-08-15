import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';



// ceuil-badge.model.ts
export interface SeuilBadge {
  id: number;
  nom: string;
  image: string;
  typeActivite: string;
  seuil: number;
  iconeSeuil: string;
}

@Component({
  selector: 'app-ceuil-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ceuil-badge.html',
  styleUrls: ['./ceuil-badge.css']
})
export class CeuilBadge {

  seuils: SeuilBadge[] = [
    { id: 1, nom: 'DEBUTANT', image: 'BadgeBronze.png', typeActivite: 'Badge attribué pour la première contribution validée', seuil: 1, iconeSeuil: 'coins.png' },
    { id: 2, nom: 'BRONZE', image: 'BadgeBronze.png', typeActivite: 'Badge Bronze attribué après 5 contributions validées', seuil: 2, iconeSeuil: 'coins.png' },
    { id: 3, nom: 'ARGENT', image: 'BadgeArgent.png', typeActivite: 'Badge Argent attribué après 10 contributions validées', seuil: 5, iconeSeuil: 'coins.png' },
    { id: 4, nom: 'OR', image: 'BadgeOr.png', typeActivite: 'Badge Or attribué après 20 contributions validées', seuil: 10, iconeSeuil: 'coins.png' },
    { id: 5, nom: 'PLATINE', image: 'platine.png', typeActivite: 'Badge Platine attribué après 50 contributions validées', seuil: 20, iconeSeuil: 'coins.png' }
  ];

  editSeuil(seuil: SeuilBadge) {
    console.log('Éditer seuil', seuil);
    // Ici tu pourras ouvrir un formulaire d'édition
  }

  saveSeuils() {
    console.log('Enregistrer tous les seuils');
    // Appel HTTP vers backend
  }
}
