import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  constructor(private http: HttpClient) {}

  getUserTransactions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/transactions/${userId}`);
  }
}
