import { Component, OnInit, ChangeDetectorRef, NgZone } from "@angular/core";
import { ProjectsService, Projet } from "../../../../core/projects-service";
import { Banniere } from "../../../../shared/ui-components/banniere/banniere";
import { CardProjectActif } from "../../../../shared/ui-components/card-project-actif/card-project-actif";
import { ProjectsRecommander } from "../../../../shared/ui-components/projects-recommander/projects-recommander";
import { CardBadges } from "../../../../shared/ui-components/card-badges/card-badges";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Banniere,
    CardProjectActif,
    ProjectsRecommander,
    CardBadges,
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  projetsActifs: Projet[] = []; // ✅ Toujours un tableau, jamais undefined
  userId = 2;
  loading = true;

  constructor(
    private projectsService: ProjectsService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProjets();
  }

  chargerProjets(): void {
    this.loading = true;
    this.projectsService.getProjetsActifs(this.userId).subscribe({
      next: (projets) => {
        this.zone.run(() => {
          this.projetsActifs = projets || []; // ✅ toujours un tableau
          this.loading = false;
           console.error('Erreur chargement projets:', projets);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Erreur chargement projets:', err);
        this.zone.run(() => {
          this.projetsActifs = []; // ✅ tableau vide
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}

