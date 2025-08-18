import { Component } from '@angular/core';

@Component({
  selector: 'app-parametrage-coins',
  imports: [],
  templateUrl: './parametrage-coins.html',
  styleUrl: './parametrage-coins.css'
})
export interface ParametreCoin {
  id?: number;
  nom: string;
  description: string;
  typeEvenementLien: string;
  valeur: number;
  administrateurId?: number; // Supposons que l'ID de l'administrateur est envoyé au backend
}
export class ParametrageCoins {

}
