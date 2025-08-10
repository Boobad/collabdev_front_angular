import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { Feature, FeatureCreateRequest, ID, MessageResponse } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class FeaturesService {
  constructor(private http: HttpClient) {}

  listByProject(projetId: ID): Observable<Feature[]> {
    return this.http.get<Feature[]>(apiUrl(`/fonctions/projet/${projetId}`))
  }

  get(id: ID): Observable<Feature> {
    return this.http.get<Feature>(apiUrl(`/fonctions/${id}`))
  }

  create(payload: FeatureCreateRequest): Observable<Feature> {
    return this.http.post<Feature>(apiUrl("/fonctions"), payload)
  }

  update(id: ID, patch: Partial<Feature>): Observable<Feature> {
    return this.http.put<Feature>(apiUrl(`/fonctions/${id}`), patch)
  }

  changeStatus(id: ID, statut: Feature["statut"]): Observable<Feature> {
    return this.http.patch<Feature>(apiUrl(`/fonctions/${id}/statut`), { statut })
  }

  assign(id: ID, assigneeId: ID): Observable<Feature> {
    return this.http.patch<Feature>(apiUrl(`/fonctions/${id}/assign`), { assigneeId })
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/fonctions/${id}`))
  }
}
