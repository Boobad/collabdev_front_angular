import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { AjoutProjet } from './contributeurs/pages/ajout-projet/ajout-projet';
import { Projects } from './contributeurs/pages/projects/projects';
import { CardProjectActif } from './contributeurs/components/ui/card-project-actif/card-project-actif';
import { MesCardProject } from './contributeurs/components/ui/mes-card-project/mes-card-project';
import { ProjectsRecommander } from './contributeurs/components/ui/projects-recommander/projects-recommander';
import { GestionFonctionnalite } from './contributeurs/pages/gestion-fonctionnalite/gestion-fonctionnalite';

@Component({
  selector: 'app-root',
  imports: [Sidebar,Navebar,AjoutProjet,Projects,CardProjectActif,MesCardProject,ProjectsRecommander,GestionFonctionnalite ,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
