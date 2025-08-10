import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { AdminStats, BulkValidationRequest, ID, MessageResponse, Page, Project, User } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class AdministrateursService {
  constructor(private http: HttpClient) {}

  stats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(apiUrl("/administrateurs/stats"))
  }

  // Admin projects validation
  listPendingProjects(params?: { page?: number; size?: number; search?: string }): Observable<Page<Project>> {
    return this.http.get<Page<Project>>(apiUrl("/administrateurs/projets/en-attente"), { params: params as any })
  }

  validateProject(id: ID): Observable<Project> {
    return this.http.post<Project>(apiUrl(`/administrateurs/projets/${id}/valider`), {})
  }

  rejectProject(id: ID, motif?: string): Observable<Project> {
    return this.http.post<Project>(apiUrl(`/administrateurs/projets/${id}/rejeter`), { motif })
  }

  bulkValidateOrReject(payload: BulkValidationRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl("/administrateurs/projets/bulk"), payload)
  }

  // Admin users
  listUsers(params?: { page?: number; size?: number; search?: string; role?: string }): Observable<Page<User>> {
    return this.http.get<Page<User>>(apiUrl("/administrateurs/utilisateurs"), { params: params as any })
  }

  moderateUser(id: ID, actif: boolean): Observable<User> {
    return this.http.patch<User>(apiUrl(`/administrateurs/utilisateurs/${id}/actif`), { actif })
  }
}
