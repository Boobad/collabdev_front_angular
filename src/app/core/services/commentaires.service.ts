import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { Comment, ID, MessageResponse } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class CommentairesService {
  constructor(private http: HttpClient) {}

  listByProject(projetId: ID): Observable<Comment[]> {
    return this.http.get<Comment[]>(apiUrl(`/commentaires/projet/${projetId}`))
  }

  listByContribution(contributionId: ID): Observable<Comment[]> {
    return this.http.get<Comment[]>(apiUrl(`/commentaires/contribution/${contributionId}`))
  }

  createForProject(projetId: ID, contenu: string): Observable<Comment> {
    return this.http.post<Comment>(apiUrl(`/commentaires/projet/${projetId}`), { contenu })
  }

  createForContribution(contributionId: ID, contenu: string): Observable<Comment> {
    return this.http.post<Comment>(apiUrl(`/commentaires/contribution/${contributionId}`), { contenu })
  }

  update(id: ID, contenu: string): Observable<Comment> {
    return this.http.put<Comment>(apiUrl(`/commentaires/${id}`), { contenu })
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/commentaires/${id}`))
  }
}
