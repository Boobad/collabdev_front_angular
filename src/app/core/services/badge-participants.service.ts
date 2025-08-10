import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { ID, UserBadge } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class BadgeParticipantsService {
  constructor(private http: HttpClient) {}

  listByUser(userId: ID): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(apiUrl(`/badge-participants/utilisateur/${userId}`))
  }

  progressByUser(userId: ID): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(apiUrl(`/badge-participants/utilisateur/${userId}/progression`))
  }
}
