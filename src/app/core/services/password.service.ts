import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import  { MessageResponse, PasswordResetRequest, ResetPasswordPayload } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class PasswordService {
  constructor(private http: HttpClient) {}

  forgotPassword(payload: PasswordResetRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl("/auth/forgot-password"), payload)
  }

  validateResetToken(token: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(apiUrl(`/auth/reset-password/validate?token=${encodeURIComponent(token)}`))
  }

  resetPassword(payload: ResetPasswordPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl("/auth/reset-password"), payload)
  }
}
