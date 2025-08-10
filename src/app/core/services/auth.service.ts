import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { type Observable, tap } from "rxjs"
import { apiUrl } from "./api.config"
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "auth_user"

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(apiUrl("/auth/login"), payload).pipe(
      tap((res) => {
        if (res.token) this.setToken(res.token)
        if (res.data) this.setUser(res.data)
      }),
    )
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(apiUrl("/auth/register"), payload).pipe(
      tap((res) => {
        if (res.token) this.setToken(res.token)
        if (res.data) this.setUser(res.data)
      }),
    )
  }

  me(): Observable<User> {
    return this.http.get<User>(apiUrl("/auth/me"))
  }

  logout() {
    this.clear()
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  get user(): User | null {
    const raw = localStorage.getItem(this.USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  }

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token)
  }
  private setUser(user: User) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }
  private clear() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }
}
