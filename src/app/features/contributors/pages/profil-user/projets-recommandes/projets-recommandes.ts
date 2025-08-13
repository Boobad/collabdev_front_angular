import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsRecommander } from '../../../../../shared/ui-components/projects-recommander/projects-recommander';

@Component({
  selector: 'app-projets-recommandes',
  standalone: true,
  imports: [
    ProjectsRecommander,
    CommonModule,
    MatIconModule // Ajout de MatIconModule
  ],
  templateUrl: './projets-recommandes.html',
  styleUrl: './projets-recommandes.css'
})
export class ProjetsRecommandes {
  constructor(private location: Location) {}

   isLoading: boolean = true; // Ajoutez cette ligne
  backToHome(): void {
    this.location.back();
  }
}
