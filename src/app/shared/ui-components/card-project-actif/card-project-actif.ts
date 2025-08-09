import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Projet } from '../../../core/projects-service';

@Component({
  selector: 'app-card-project-actif',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-project-actif.html',
  styleUrls: ['./card-project-actif.css'],
})
export class CardProjectActif {
  @Input() projet!: Projet;

  getProgress(): number {
    switch (this.projet.status) {
      case 'EN_ATTENTE':
        return 0;
      case 'REJETE':
        return 0;
      case 'OUVERT':
        return 20;
      case 'EN_COURS':
        return 50;
      case 'TERMINER':
        return 100;
      default:
        return 0;
    }
  }

  getProgressColor(): string {
    switch (this.projet.status) {
      case 'REJETE':
        return '#e53935'; // rouge
      case 'OUVERT':
        return '#1e88e5'; // bleu
      case 'EN_COURS':
        return '#fb8c00'; // orange
      case 'TERMINER':
        return '#43a047'; // vert
      default:
        return '#9e9e9e'; // gris
    }
  }
}
