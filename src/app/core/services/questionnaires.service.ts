import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import { ID, MessageResponse, Quiz, QuizCreateRequest, QuizSubmitRequest } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class QuestionnairesService {
  constructor(private http: HttpClient) {}

  list(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(apiUrl("/questionnaires"))
  }

  get(id: ID): Observable<Quiz> {
    return this.http.get<Quiz>(apiUrl(`/questionnaires/${id}`))
  }

  create(payload: QuizCreateRequest): Observable<Quiz> {
    return this.http.post<Quiz>(apiUrl("/questionnaires"), payload)
  }

  update(id: ID, patch: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(apiUrl(`/questionnaires/${id}`), patch)
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/questionnaires/${id}`))
  }

  // Templates de quiz
  listTemplates(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(apiUrl("/questionnaires/templates"))
  }

  // Participation quiz projet
  startProjectQuiz(projetId: ID): Observable<Quiz> {
    return this.http.post<Quiz>(apiUrl(`/questionnaires/projet/${projetId}/start`), {})
  }

  submitProjectQuiz(projetId: ID, payload: QuizSubmitRequest): Observable<{ score: number; details?: any }> {
    return this.http.post<{ score: number; details?: any }>(
      apiUrl(`/questionnaires/projet/${projetId}/submit`),
      payload,
    )
  }
}
