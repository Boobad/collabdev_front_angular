import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './api.config';

export interface Fonctionnalite {
  id: number;
  titre: string;
  contenu: string;
  statusFeatures: 'A_FAIRE' | 'EN_COURS' | 'TERMINE';
  dateEcheance: string | null;
  participantNomComplet: string;
  participantEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class FonctionnalitesService {
  private apiUrl = apiUrl(`/fonctionnalites`);

  constructor(private http: HttpClient) {}
createFeature(featureData: any) {
  return this.http.post<any>(`${this.apiUrl}/projet/${featureData.projetId}`, featureData);
}

getFonctionnalitesByProjet(projetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  // Méthode pour mettre à jour uniquement le statut d'une fonctionnalité
updateStatus(id: number, status: string) {
  return this.http.patch(`${this.apiUrl}/${id}/status?status=${status}`, null);
}

}