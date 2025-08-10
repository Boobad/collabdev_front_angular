import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { ID, MessageResponse, Notification } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class NotificationsService {
  constructor(private http: HttpClient) {}

  listMine(): Observable<Notification[]> {
    return this.http.get<Notification[]>(apiUrl("/notifications"))
  }

  markRead(id: ID): Observable<Notification> {
    return this.http.post<Notification>(apiUrl(`/notifications/${id}/lire`), {})
  }

  markAllRead(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl("/notifications/tout-lire"), {})
  }
}
