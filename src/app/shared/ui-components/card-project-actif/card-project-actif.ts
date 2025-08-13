import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Projet } from '../../../core/projects-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feature {
  id: number;
  titre: string;
  contenu: string;
  statusFeatures: string; // A_FAIRE, EN_COURS, TERMINE
}

@Component({
  selector: 'app-card-project-actif',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-project-actif.html',
  styleUrls: ['./card-project-actif.css'],
})
export class CardProjectActif {
  private _projet!: Projet;
  totalTaches = 0;
  tachesTerminees = 0;

  private baseUrl = 'http://localhost:8080/api/v1/fonctionnalites';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  @Input()
  set projet(value: Projet) {
    this._projet = value;
    if (value?.id) {
      this.loadTaches(value.id); // recharge à chaque changement
    }
  }

  get projet(): Projet {
    return this._projet;
  }

  private getFeaturesByProject(idProjet: number): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.baseUrl}/projet/${idProjet}`);
  }

  private loadTaches(idProjet: number) {
    this.getFeaturesByProject(idProjet).subscribe({
      next: (features) => {
        this.totalTaches = features.length;
        this.tachesTerminees = features.filter(f => f.statusFeatures === 'TERMINE').length;
        this.cdr.detectChanges(); // Force la détection de changement
      },
      error: (err) => console.error('Erreur récupération fonctionnalités', err)
    });
  }

  getProgress(): number {
    if (this.totalTaches === 0) return 0;
    return Math.round((this.tachesTerminees / this.totalTaches) * 100);
  }

  getProgressColor(): string {
    const progress = this.getProgress();
    if (progress === 100) return '#43a047';
    if (progress >= 50) return '#fb8c00';
    if (progress > 0) return '#1e88e5';
    return '#9e9e9e';
  }
}
