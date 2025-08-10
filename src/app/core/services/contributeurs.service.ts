import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { ID, MessageResponse, Page, User } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class ContributeursService {
  constructor(private http: HttpClient) {}

  list(params?: { page?: number; size?: number; search?: string }): Observable<Page<User>> {
    return this.http.get<Page<User>>(apiUrl("/contributeurs"), { params: params as any })
  }

  get(id: ID): Observable<User> {
    return this.http.get<User>(apiUrl(`/contributeurs/${id}`))
  }

  solde(id: ID): Observable<{ coins: number; xp: number }> {
    return this.http.get<{ coins: number; xp: number }>(apiUrl(`/contributeurs/${id}/solde`))
  }

  reward(id: ID, coins: number, motif?: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl(`/contributeurs/${id}/recompense`), { coins, motif })
  }
}
