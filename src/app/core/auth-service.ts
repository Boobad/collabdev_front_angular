import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();
  
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}
loginWithGoogle(userData: any) {
  return this.http.post<any>('http://localhost:8080/api/v1/auth/login', userData);
}

  // Récupère le profil par ID
  getProfileById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${id}`);
  }

  // Connexion utilisateur (sans token, avec vérification actif)
  loginUser(credentials: { email: string, password: string }): Observable<any> {
    this.authState.next(true);
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Réponse API login:', response);
 this.authState.next(true);
        // Vérifier si l'utilisateur est actif
        if (response && response.id && response.actif === true) {
          // Stocker l'objet utilisateur complet
          localStorage.setItem('user', JSON.stringify(response));

          // Stocker uniquement l'ID utilisateur
          localStorage.setItem('userId', response.id.toString());

          console.log('Utilisateur actif, stocké dans localStorage.');
        } else {
          console.warn('Utilisateur inactif ou réponse invalide, connexion refusée.');
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

  // Connexion avec Google
  loginWithGoogleToken(idToken: string) {
    return this.http.post<{ token: string }>(
      'http://localhost:8080/login/oauth2/code/google',
      { idToken }
    );
  }

  // Sauvegarde token (si un jour ton API en renvoie)
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Vérifie si un utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    console.log('Utilisateur déconnecté, localStorage vidé.');
  }
}
