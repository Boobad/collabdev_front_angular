import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import { API_BASE_URL, buildHttpParams } from "./api.config"
import type { Comment, MessageResponse, Page } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class CommentsService {
  private base = `${API_BASE_URL}/comments`

  constructor(private http: HttpClient) {}

  listByProject(projectId: number | string, params?: { page?: number; size?: number }): Observable<Page<Comment>> {
    const p = buildHttpParams(params);
    return this.http.get<Page<Comment>>(`${this.base}/project/${projectId}`, { params: p })
  }

  addToProject(projectId: number | string, contenu: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.base}/project/${projectId}`, { contenu })
  }

  delete(commentId: number | string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.base}/${commentId}`)
  }
}
