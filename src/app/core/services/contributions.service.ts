import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { Contribution, ContributionSubmitRequest, ID, MessageResponse } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class ContributionsService {
  constructor(private http: HttpClient) {}

  listByProject(projetId: ID): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(apiUrl(`/contributions/projet/${projetId}`))
  }

  listByUser(userId: ID): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(apiUrl(`/contributions/utilisateur/${userId}`))
  }

  submit(projetId: ID, payload: ContributionSubmitRequest): Observable<Contribution> {
    const fd = new FormData()
    if (payload.description) fd.set("description", payload.description)
    if (payload.lienRepo) fd.set("lienRepo", payload.lienRepo)
    if (payload.fichier) fd.set("fichier", payload.fichier)
    return this.http.post<Contribution>(apiUrl(`/contributions/projet/${projetId}`), fd)
  }

  validate(id: ID, recompenseCoin?: number): Observable<Contribution> {
    return this.http.post<Contribution>(apiUrl(`/contributions/${id}/valider`), { recompenseCoin })
  }

  reject(id: ID, motif?: string): Observable<Contribution> {
    return this.http.post<Contribution>(apiUrl(`/contributions/${id}/rejeter`), { motif })
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/contributions/${id}`))
  }
}
