import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  // Récupère le profil par ID
  getProfileById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${id}`);
  }

  // Connexion utilisateur
  loginUser(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Suppose que la réponse contient le token et les infos user
        if (response.token) {
          this.saveToken(response.token);
        }
        if (response.user) {
          // Stocker l’objet utilisateur complet
          localStorage.setItem('user', JSON.stringify(response.user));
          // Stocker l’ID utilisateur en string
          localStorage.setItem('userId', response.user.id.toString());
        }
      })
    );
  }

  // Enregistrer un nouvel utilisateur
  registerUser(userData: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  loginWithGoogleToken(idToken: string) {
    return this.http.post<{ token: string }>(
      'http://localhost:8080/login/oauth2/code/google',
      { idToken }
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }
}
