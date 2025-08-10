import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ProjectsRecommander } from '../../../../shared/ui-components/projects-recommander/projects-recommander';
import { RouterLink } from '@angular/router';
import { AppInsufficientCoinsDialog } from '../../../../shared/ui-components/app-insufficient-coins-dialog/app-insufficient-coins-dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projets-recommandes',
  standalone: true,
  imports: [
     ProjectsRecommander,
    RouterLink,
    CommonModule,
    AppInsufficientCoinsDialog,
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