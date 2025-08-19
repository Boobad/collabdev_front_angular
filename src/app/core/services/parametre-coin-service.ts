import { Injectable } from '@angular/core';
import { ParametreCoin } from '../../features/admin/pages/component_admin_param/parametrage-coins/parametrage-coins';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametreCoinService {
  private apiUrl = 'http://localhost:8080//api/v1/parametres-coins'; // Ajustez selon l'URL de votre API backend

  constructor(private http: HttpClient) {}

  // Récupérer tous les ParametreCoin
  getParametreCoins(): Observable<ParametreCoin[]> {
    return this.http.get<ParametreCoin[]>(this.apiUrl);
  }

  // Enregistrer un nouveau ParametreCoin
  saveParametreCoin(parametre: ParametreCoin): Observable<ParametreCoin> {
    return this.http.post<ParametreCoin>(this.apiUrl, parametre);
  }

  // Mettre à jour un ParametreCoin existant
  updateParametreCoin(id: number, parametre: ParametreCoin): Observable<ParametreCoin> {
    return this.http.put<ParametreCoin>(`${this.apiUrl}/${id}`, parametre);
  }
}
