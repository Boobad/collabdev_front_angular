import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectsRecommander } from '../../../../shared/ui-components/projects-recommander/projects-recommander';
import { RouterLink } from '@angular/router';
import { AppInsufficientCoinsDialog } from '../../../../shared/ui-components/app-insufficient-coins-dialog/app-insufficient-coins-dialog';

@Component({
  selector: 'app-projets-recommandes',
  imports: [ProjectsRecommander,RouterLink,AppInsufficientCoinsDialog],
  standalone: true,
  templateUrl: './projets-recommandes.html',
  styleUrl: './projets-recommandes.css'
})
export class ProjetsRecommandes {


  constructor(private location: Location) {}

  backToHome(): void {
    this.location.back();
  }  }

