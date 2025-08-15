// src/app/services/badge.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Badge {
  id: number;
  type: string;
  description: string;
  nombreContribution: number;
  coin_recompense: number;
  createurEmail: string;
}

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private apiUrl = 'http://localhost:8080/api/v1/badges';

  constructor(private http: HttpClient) {}

  getBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(this.apiUrl);
  }
}
