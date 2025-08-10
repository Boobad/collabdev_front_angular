import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Projet {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  secteur: string;
  urlCahierDeCharge?: string;
  status: string;
  nombreParticipants: number;
  nombreFonctionnalites: number;
  // autres champs si nécessaire
}

export interface ProjectPayload {
  titre: string;
  description: string;
  domaine: string;
  secteur: string;
  urlCahierDeCharge?: string;
  role: string; // 'ideator' ou 'manager'
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'http://localhost:8080/api/v1/projets/contributeur';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

  createProject(userId: number, project: ProjectPayload): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('ID utilisateur manquant'));
    }

    if (!project.titre || !project.description || !project.domaine || !project.secteur) {
      return throwError(() => new Error('Tous les champs obligatoires doivent être remplis'));
    }

    return this.http.post(`${this.apiUrl}/${userId}`, project).pipe(
      catchError(error => {
        console.error('Erreur création projet:', error);
        return throwError(() => error);
      })
    );
  }

  getProjetsByContributeur(userId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Erreur récupération projets:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer uniquement les projets "actifs" selon plusieurs statuts
  getProjetsActifs(userId: number): Observable<Projet[]> {
    const statutsActifs = ['EN_ATTENTE', 'OUVERT', 'EN_COURS','TERMINER'];

    return this.getProjetsByContributeur(userId).pipe(
      map(projets => projets.filter(projet => statutsActifs.includes(projet.status)))
    );
  }
}
