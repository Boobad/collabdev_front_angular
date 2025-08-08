import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MesCardProject } from '../../../../shared/ui-components/mes-card-project/mes-card-project';

@Component({
  selector: 'app-projects',
  imports: [MesCardProject],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  constructor( private location: Location) {}

  backToHome(): void {
    // Logic to navigate back to the home page can be added here
    this.location.back(); // This will navigate back to the previous page in the history stack
  }
}
