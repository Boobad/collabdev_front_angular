import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ContributorResponse {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email: string;
  pointExp: number;
  totalCoin: number;
  actif: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  private apiUrl = 'http://localhost:8080/api/v1/contributeurs';

   private coinsValueSource = new BehaviorSubject<number>(0);
  coinsValue$ = this.coinsValueSource.asObservable();

  setCoinsValue(value: number) {
    this.coinsValueSource.next(value);
  }

  constructor(private http: HttpClient) {}

  // Récupérer les infos complètes du contributeur par userId
  getContributorByUserId(userId: number): Observable<ContributorResponse> {
    return this.http.get<ContributorResponse>(`${this.apiUrl}/${userId}`);
  }
}
