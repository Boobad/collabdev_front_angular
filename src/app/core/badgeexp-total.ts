import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


export interface Badge {
  idBadge: number;
  typeBadge: string;
  description: string;
  nombreContribution: number;
  coinRecompense: number;
  dateAcquisition: string;
}

export interface HistoriqueResponse {
  idParticipant: number;
  contributionValidees: any[];
  badgesAcquis: Badge[];
}


@Injectable({
  providedIn: 'root'
})
export class BadgeexpTotal {
  private apiUrl = 'http://localhost:8080/api/v1/participants';

  constructor(private http: HttpClient) {}

  getHistoriqueByParticipantId(participantId: number): Observable<HistoriqueResponse> {
    return this.http.get<HistoriqueResponse>(`${this.apiUrl}/${participantId}/historique`);
  }
}
