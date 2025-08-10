import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { ID, MessageResponse, TemplateProject } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class TemplatesService {
  constructor(private http: HttpClient) {}

  list(params?: { search?: string; page?: number; size?: number }): Observable<TemplateProject[]> {
    return this.http.get<TemplateProject[]>(apiUrl("/templates"), { params: params as any })
  }

  get(id: ID): Observable<TemplateProject> {
    return this.http.get<TemplateProject>(apiUrl(`/templates/${id}`))
  }

  create(payload: Partial<TemplateProject>): Observable<TemplateProject> {
    return this.http.post<TemplateProject>(apiUrl("/templates"), payload)
  }

  update(id: ID, patch: Partial<TemplateProject>): Observable<TemplateProject> {
    return this.http.put<TemplateProject>(apiUrl(`/templates/${id}`), patch)
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/templates/${id}`))
  }
}
