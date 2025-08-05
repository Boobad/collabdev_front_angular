import { Component } from '@angular/core';
import { ProjectsRecommander } from '../../components/ui/projects-recommander/projects-recommander';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projets-recommandes',
  imports: [ProjectsRecommander, RouterLink],
  templateUrl: './projets-recommandes.html',
  styleUrl: './projets-recommandes.css'
})
export class ProjetsRecommandes {

}
