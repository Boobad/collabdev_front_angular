import { Injectable } from "@angular/core"
import  { HttpClient, HttpParams } from "@angular/common/http"
import  { Observable } from "rxjs"
import { apiUrl, buildHttpParams } from "./api.config"
import  { ID, MessageResponse, Page, Project, ProjectCreateRequest } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class ProjectsService {
  constructor(private http: HttpClient) {}

  list(params?: {
    search?: string
    domaine?: string
    secteur?: string
    statut?: string
    page?: number
    size?: number
  }): Observable<Page<Project>> {
    const httpParams = buildHttpParams(params) as HttpParams
    return this.http.get<Page<Project>>(apiUrl("/projets"), { params: httpParams })
  }

  listOpen(params?: { page?: number; size?: number }): Observable<Page<Project>> {
    const httpParams = buildHttpParams(params) as HttpParams
    return this.http.get<Page<Project>>(apiUrl("/projets/ouverts"), { params: httpParams })
  }

  get(id: ID): Observable<Project> {
    return this.http.get<Project>(apiUrl(`/projets/${id}`))
  }

  create(payload: ProjectCreateRequest): Observable<Project> {
    if (payload.cahierDesChargesFile) {
      const fd = new FormData()
      fd.set("titre", payload.titre)
      fd.set("description", payload.description)
      if (payload.domaine) fd.set("domaine", payload.domaine)
      if (payload.secteur) fd.set("secteur", payload.secteur)
      if (payload.roleSoumis) fd.set("roleSoumis", payload.roleSoumis)
      if (payload.gestionnaireCandidatId !== undefined && payload.gestionnaireCandidatId !== null) {
        fd.set("gestionnaireCandidatId", String(payload.gestionnaireCandidatId))
      }
      fd.set("cahierDesCharges", payload.cahierDesChargesFile)
      return this.http.post<Project>(apiUrl("/projets"), fd)
    }
    return this.http.post<Project>(apiUrl("/projets"), payload)
  }


  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/projets/${id}`))
  }

private baseUrl = 'http://localhost:8080/api/v1/projets';

deleteProject(id: number): Observable<void> {
  // Exemple pour la route sécurisée avec idCreateur
  const userId = localStorage.getItem('userId');
  return this.http.delete<void>(`${this.baseUrl}/${id}/createur/${userId}`);
}

update(id: number, project: any): Observable<any> {
  const userId = localStorage.getItem('userId');
  return this.http.put<any>(`${this.baseUrl}/${id}/createur/${userId}`, project);
}

  // Share idea endpoint (projects/partager)
  shareIdea(payload: ProjectCreateRequest): Observable<Project> {
    const fd = new FormData()
    fd.set("titre", payload.titre)
    fd.set("description", payload.description)
    if (payload.domaine) fd.set("domaine", payload.domaine)
    if (payload.secteur) fd.set("secteur", payload.secteur)
    if (payload.roleSoumis) fd.set("roleSoumis", payload.roleSoumis)
    if (payload.gestionnaireCandidatId !== undefined && payload.gestionnaireCandidatId !== null) {
      fd.set("gestionnaireCandidatId", String(payload.gestionnaireCandidatId))
    }
    if (payload.cahierDesChargesFile) fd.set("cahierDesCharges", payload.cahierDesChargesFile)
    return this.http.post<Project>(apiUrl("/projets/partager"), fd)
  }

  getParticipants(projectId: string) {
  return this.http.get<any[]>(`http://localhost:8080/api/v1/participants/projet/${projectId}`);
}

}
