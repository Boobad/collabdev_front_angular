import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BadgeexpTotal {
  private apiBaseUrl = 'http://localhost:8080/api/v1/badge-contributeurs/contributeur';

  constructor(private http: HttpClient) { }

  /** Récupère le nombre de badges pour un utilisateur donné */
getBadgeCountByUserId(userId: number) {
  return this.http.get<number>(`${this.apiBaseUrl}/${userId}/count`);
}


}
