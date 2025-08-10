import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { ID, MessageResponse, Page, User } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class UsersService {
  constructor(private http: HttpClient) {}

  list(params?: { search?: string; role?: string; page?: number; size?: number }): Observable<Page<User>> {
    return this.http.get<Page<User>>(apiUrl("/utilisateurs"), { params: params as any })
  }

  get(id: ID): Observable<User> {
    return this.http.get<User>(apiUrl(`/utilisateurs/${id}`))
  }

  update(id: ID, patch: Partial<User>): Observable<User> {
    return this.http.put<User>(apiUrl(`/utilisateurs/${id}`), patch)
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/utilisateurs/${id}`))
  }

  stats(): Observable<{ total: number; actifs: number; admins: number; gestionnaires: number; contributeurs: number }> {
    return this.http.get<{
      total: number
      actifs: number
      admins: number
      gestionnaires: number
      contributeurs: number
    }>(apiUrl("/utilisateurs/stats"))
  }
}
