import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './services/api.config';

export interface ParticipationRequest {
  id: number;
  profil: string;
  statut: string;
  scoreQuiz: string;
  estDebloque: boolean;
  datePostulation: string;
  commentaireMotivation: string;
  commentaireExperience: string;
  projetId: number;
  contributeurId: number;
}

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private baseUrl = apiUrl(`/participants`);

  constructor(private http: HttpClient) {}

  envoyerParticipation(
    idProjet: number,
    idContributeur: number,
    data: ParticipationRequest
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/projet/${idProjet}/contributeur/${idContributeur}`,
      data
    );
  }
}
