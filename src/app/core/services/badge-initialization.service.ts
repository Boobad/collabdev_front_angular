import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { MessageResponse } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class BadgeInitializationService {
  constructor(private http: HttpClient) {}

  initialize(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl("/badge-initialization/init"), {})
  }
}
