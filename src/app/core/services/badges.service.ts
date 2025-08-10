import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { Badge, ID, MessageResponse } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class BadgesService {
  constructor(private http: HttpClient) {}

  list(): Observable<Badge[]> {
    return this.http.get<Badge[]>(apiUrl("/badges"))
  }

  get(id: ID): Observable<Badge> {
    return this.http.get<Badge>(apiUrl(`/badges/${id}`))
  }

  create(payload: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(apiUrl("/badges"), payload)
  }

  update(id: ID, patch: Partial<Badge>): Observable<Badge> {
    return this.http.put<Badge>(apiUrl(`/badges/${id}`), patch)
  }

  remove(id: ID): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(apiUrl(`/badges/${id}`))
  }
}
