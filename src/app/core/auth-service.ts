import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth/login'; // adapte cette URL si besoin

  constructor(private http: HttpClient) {}

  // Appel API pour se connecter
  loginUser(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  // Stocke le token JWT dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Vérifie si un token existe
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Supprime le token
  logout(): void {
    localStorage.removeItem('token');
  }
}
