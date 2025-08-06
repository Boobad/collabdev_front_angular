import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-recommander',
  imports: [],
  templateUrl: './projects-recommander.html',
  styleUrl: './projects-recommander.css'
})
export class ProjectsRecommander {
  constructor(private router: Router) {}

  onJoinProject() {
    // Redirige vers une page de confirmation (à adapter selon votre routing)
    this.router.navigate(['/formulaire-participation']);
  }
}