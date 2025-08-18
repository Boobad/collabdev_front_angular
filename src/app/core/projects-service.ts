import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private apiUrll = 'http://localhost:8080/api/v1/projets';



  getProjetById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrll}/${id}`);
  }

  uploadFile(file: File): Observable<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

  createProject(userId: number, projet: ProjectPayload, file?: File): Observable<any> {
    const formData = new FormData();

    // Création de l'objet projet sans la propriété urlCahierDeCharge
    const { urlCahierDeCharge, ...projetData } = projet;

    // Ajout de l'objet projet en tant que blob JSON
    formData.append('projet', new Blob([JSON.stringify(projetData)], {
      type: 'application/json'
    }));

    // Ajout du fichier s'il existe
    if (file) {
      formData.append('cahierDesCharges', file, file.name);
    }

    return this.http.post(`${this.apiUrl}/${userId}`, formData, {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data'
      })
    }).pipe(
      catchError(error => {
        console.error('Erreur création projet:', error);
        return throwError(() => error);
      })
    );
  }
  // projects-service.ts
  createProjectMultipart(userId: number, formData: FormData) {
    return this.http.post<any>(`http://localhost:8080/api/v1/projets/contributeur/${userId}`, formData);
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
    const statutsActifs = ['OUVERT', 'EN_COURS','TERMINER'];

    return this.getProjetsByContributeur(userId).pipe(
      map(projets => projets.filter(projet => statutsActifs.includes(projet.status)))
    );
  }
   // Récupérer uniquement les projets "actifs" selon plusieurs statuts
  getProjetsAttente(userId: number): Observable<Projet[]> {
    const statutsActifs = ['EN_ATTENTE'];

    return this.getProjetsByContributeur(userId).pipe(
      map(projets => projets.filter(projet => statutsActifs.includes(projet.status)))
    );
  }


}
