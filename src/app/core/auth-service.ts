import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth'; // adapte cette URL si besoin



  constructor(private http: HttpClient) {}


  loginWithGoogleToken(idToken: string) {
  return this.http.post<{ token: string }>(
    'http://localhost:8080/login/oauth2/code/google',
    { idToken }
  );
}


  // In your auth-service.ts
registerUser(userData: {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  password: string;
}): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, userData);
}

  // Appel API pour se connecter
  loginUser(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
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
