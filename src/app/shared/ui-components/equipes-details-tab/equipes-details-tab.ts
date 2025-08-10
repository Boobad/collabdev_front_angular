import { Component, OnInit } from '@angular/core';
import { Participant, ParticipantsService } from '../../../core/services/participants.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equipes-details-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipes-details-tab.html',
  styleUrls: ['./equipes-details-tab.css']
})
export class EquipesDetailsTab implements OnInit {
  private _participants: Participant[] = [];
  
  // Getter et Setter avec log des changements
  get participants(): Participant[] {
    return this._participants;
  }
  
  set participants(value: Participant[]) {
    console.log('Changement détecté dans la liste des participants:');
    console.log('Ancienne valeur:', this._participants);
    console.log('Nouvelle valeur:', value);
    this._participants = value;
  }

  projetId: number = 2; // À adapter selon votre logique

  constructor(private participantsService: ParticipantsService) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

loadParticipants(): void {
  console.log('Début du chargement des participants...');
  this.participantsService.getParticipantsByProject(this.projetId).subscribe({
    next: (data: Participant[]) => {
      console.log('Données reçues du service:', JSON.stringify(data, null, 2));
      this.participants = data; // Déclenche le setter avec log
      
      // Affichage supplémentaire dans la console
      console.log('Nombre de participants chargés:', data.length);
      if (data.length > 0) {
        console.log('Premier participant:', data[0]);
      }
    },
    error: (err: any) => {
      console.error('Erreur lors du chargement des participants:', err);
      console.error('Détails de l\'erreur:', err.message, err.status);
    },
    complete: () => {
      console.log('Chargement des participants terminé');
    }
  });
}
}