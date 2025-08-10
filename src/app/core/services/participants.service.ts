import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import  { ID, MessageResponse, ParticipationRequest } from "../types/api.models"

export interface Participant {
  id: number;
  profil: string;
  statut: string;
  scoreQuiz: string;
  estDebloque: boolean;
  contributeurNom: string;
  contributeurPrenom: string;
  contributeurEmail: string;
  projetTitre: string;
}

@Injectable({ providedIn: "root" })
export class ParticipantsService {
  constructor(private http: HttpClient) {}

  // demande de participation (candidat)
  requestParticipation(projetId: ID, motivation?: string): Observable<ParticipationRequest> {
    return this.http.post<ParticipationRequest>(apiUrl(`/participants/projet/${projetId}/demande`), { motivation })
  }

  // gestionnaire: lister demandes
  listRequests(projetId: ID): Observable<ParticipationRequest[]> {
    return this.http.get<ParticipationRequest[]>(apiUrl(`/participants/projet/${projetId}/demandes`))
  }

  approveRequest(demandeId: ID): Observable<ParticipationRequest> {
    return this.http.post<ParticipationRequest>(apiUrl(`/participants/demandes/${demandeId}/valider`), {})
  }

  rejectRequest(demandeId: ID, motif?: string): Observable<ParticipationRequest> {
    return this.http.post<ParticipationRequest>(apiUrl(`/participants/demandes/${demandeId}/rejeter`), { motif })
  }

  removeFromProject(projetId: ID, userId: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/participants/projet/${projetId}/utilisateur/${userId}`))
  }

   // Récupérer la liste des participants pour un projet donné
  getParticipantsByProject(projetId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(apiUrl(`/participants/projet/${projetId}`));
  }

}
