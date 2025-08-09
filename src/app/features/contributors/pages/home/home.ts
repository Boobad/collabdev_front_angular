import { Component, OnInit } from "@angular/core";
import { ProjectsService, Projet } from "../../../../core/projects-service";
import { Banniere } from "../../../../shared/ui-components/banniere/banniere";
import { CardProjectActif } from "../../../../shared/ui-components/card-project-actif/card-project-actif";
import { ProjectsRecommander } from "../../../../shared/ui-components/projects-recommander/projects-recommander";
import { CardBadges } from "../../../../shared/ui-components/card-badges/card-badges";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-home',
  imports: [Banniere, CardProjectActif, 
    ProjectsRecommander, CardBadges, RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],   // <-- ici, pluriel et tableau
})
export class Home implements OnInit {
  projetsActifs: Projet[] = [];
  userId = 2;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getProjetsActifs(this.userId).subscribe({
      next: (projets) => {
        console.log('Projets chargés dans le composant:', projets);
        this.projetsActifs = projets;
      },
      error: (err) => {
        console.error('Erreur chargement projets:', err);
      }
    });
  }
}
