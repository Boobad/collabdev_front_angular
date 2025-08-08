import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mes-card-project',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './mes-card-project.html',
  styleUrl: './mes-card-project.css'
})
export class MesCardProject {
    // Ajoutez ici les propriétés et méthodes nécessaires pour votre composant
    @Input() domaine!: string;
    @Input() coin!: number;
    @Input() titleProject!: string;
    @Input() description!: string;
    @Input() langages!:string[];
    
}
