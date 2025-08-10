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
  projetsActifs: Projet[] = [];
  userId: number | undefined; // Déclaré sans valeur initiale
  loading = true;

  constructor(
    private projectsService: ProjectsService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserIdFromLocalStorage();
    this.chargerProjets();
  }

  private getUserIdFromLocalStorage(): void {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.userId = user.id;
        console.log('User ID récupéré:', this.userId);
      } else {
        console.warn('Aucun utilisateur trouvé dans le localStorage');
        this.userId = 0; // Valeur par défaut ou gestion d'erreur
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      this.userId = 0; // Valeur par défaut en cas d'erreur
    }
  }

  chargerProjets(): void {
    if (!this.userId) {
      console.error('User ID non disponible');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.projectsService.getProjetsActifs(this.userId).subscribe({
      next: (projets) => {
        this.zone.run(() => {
          this.projetsActifs = projets || [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Erreur chargement projets:', err);
        this.zone.run(() => {
          this.projetsActifs = [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}