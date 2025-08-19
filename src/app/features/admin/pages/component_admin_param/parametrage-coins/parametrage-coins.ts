// src/app/parametrage-coins/parametrage-coins.component.ts
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ParametreCoinService } from '../../../../../core/services/parametre-coin-service';
import { pipe } from 'rxjs';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface ParametreCoin {
  id?: number;
  nom: string;
  description: string;
  typeEvenementLien: string;
  valeur: number;
  administrateurId?: number; // Supposons que l'ID de l'administrateur est envoyé au backend
}
@Component({
  selector: 'app-parametrage-coins',
  imports: [CommonModule,FormsModule],
  templateUrl: './parametrage-coins.html',
  styleUrls: ['./parametrage-coins.css']
})

export class ParametrageCoins implements OnInit {
  badgeName: string = 'gold'; // Valeur par défaut pour le select
  coinThreshold: number | null = null;
  inscriptionValue: number | null = null;
  events: { name: string; facile: number | null; moyen: number | null; difficile: number | null }[] = [
    { name: '', facile: null, moyen: null, difficile: null },
    { name: 'Lancement Projet', facile: null, moyen: null, difficile: null },
    { name: 'Contribution Projet', facile: null, moyen: null, difficile: null },
    { name: 'Déblocage Projet', facile: null, moyen: null, difficile: null }
  ];

  constructor(private parametreCoinService: ParametreCoinService) {}

  ngOnInit(): void {
    // Charger les données existantes depuis le backend
    this.loadParametreCoins();
  }

  loadParametreCoins(): void {
    this.parametreCoinService.getParametreCoins().subscribe({
      next: (data: ParametreCoin[]) => {
        // Mettre à jour les seuils des badges
        const badgeData = data.filter(p => p.typeEvenementLien === 'BADGE');
        badgeData.forEach(badge => {
          if (badge.nom === 'Gold') this.coinThreshold = badge.valeur;
          if (badge.nom === 'Platine') this.coinThreshold = badge.valeur;
          if (badge.nom === 'Argent') this.coinThreshold = badge.valeur; // Exemple pour Gold
          // Ajouter pour Argent et Platine si nécessaire
        });

        // Mettre à jour les valeurs des événements
        const eventData = data.filter(p => p.typeEvenementLien !== 'BADGE');
        eventData.forEach(event => {
          const eventRow = this.events.find(e => e.name === event.nom);
          if (eventRow) {
            if (event.typeEvenementLien === 'FACILE') eventRow.facile = event.valeur;
            else if (event.typeEvenementLien === 'MOYEN') eventRow.moyen = event.valeur;
            else if (event.typeEvenementLien === 'DIFFICILE') eventRow.difficile = event.valeur;
            else if (event.typeEvenementLien === 'INSCRIPTION') this.inscriptionValue = event.valeur;
          }
        });
      },
      error: (err) => console.error('Erreur lors du chargement des paramètres:', err)
    });
  }

  validateBadge(): void {
    if (!this.coinThreshold || this.coinThreshold <= 0) {
      alert('Veuillez entrer un seuil valide pour le badge.');
      return;
    }

    const badgeParam: ParametreCoin = {
      nom: this.badgeName.charAt(0).toUpperCase() + this.badgeName.slice(1),
      description: `Seuil pour le badge ${this.badgeName}`,
      typeEvenementLien: 'BADGE',
      valeur: this.coinThreshold,
      administrateurId: 1 // Remplacez par l'ID de l'administrateur connecté
    };

    this.parametreCoinService.saveParametreCoin(badgeParam).subscribe({
      next: () => alert('Seuil du badge enregistré avec succès !'),
      error: (err) => console.error('Erreur lors de l\'enregistrement du badge:', err)
    });
  }

  saveValues(): void {
    const parametreCoins: ParametreCoin[] = [];

    // Ajouter les valeurs des événements
    this.events.forEach(event => {
      if (event.name && (event.facile || event.moyen || event.difficile)) {
        if (event.facile) {
          parametreCoins.push({
            nom: event.name,
            description: `Valeur pour l'événement ${event.name} (Facile)`,
            typeEvenementLien: 'FACILE',
            valeur: event.facile,
            administrateurId: 1 // Remplacez par l'ID de l'administrateur connecté
          });
        }
        if (event.moyen) {
          parametreCoins.push({
            nom: event.name,
            description: `Valeur pour l'événement ${event.name} (Moyen)`,
            typeEvenementLien: 'MOYEN',
            valeur: event.moyen,
            administrateurId: 1
          });
        }
        if (event.difficile) {
          parametreCoins.push({
            nom: event.name,
            description: `Valeur pour l'événement ${event.name} (Difficile)`,
            typeEvenementLien: 'DIFFICILE',
            valeur: event.difficile,
            administrateurId: 1
          });
        }
      }
    });

    // Ajouter la valeur d'inscription
    if (this.inscriptionValue) {
      parametreCoins.push({
        nom: 'Inscription',
        description: 'Valeur pour l\'inscription',
        typeEvenementLien: 'INSCRIPTION',
        valeur: this.inscriptionValue,
        administrateurId: 1
      });
    }

    // Enregistrer toutes les valeurs
    parametreCoins.forEach(param => {
      this.parametreCoinService.saveParametreCoin(param).subscribe({
        next: () => console.log(`Paramètre ${param.nom} enregistré`),
        error: (err) => console.error('Erreur lors de l\'enregistrement:', err)
      });
    });

    alert('Valeurs enregistrées avec succès !');
  }

  // Ajouter un nouvel événement dynamiquement
  addEvent(): void {
    this.events.push({ name: '', facile: null, moyen: null, difficile: null });
  }
}