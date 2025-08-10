import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { apiUrl } from "./api.config"
import type { CoinConfig, CoinTransaction, ID, MessageResponse } from "../types/api.models"

@Injectable({ providedIn: "root" })
export class CoinsService {
  constructor(private http: HttpClient) {}

  getConfig(): Observable<CoinConfig> {
    return this.http.get<CoinConfig>(apiUrl("/parametre-coin"))
  }

  updateConfig(payload: CoinConfig): Observable<CoinConfig> {
    return this.http.put<CoinConfig>(apiUrl("/parametre-coin"), payload)
  }

  listTransactions(userId: ID): Observable<CoinTransaction[]> {
    return this.http.get<CoinTransaction[]>(apiUrl(`/parametre-coin/utilisateur/${userId}/transactions`))
  }

  spend(motif: string, montant: number): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(apiUrl("/parametre-coin/depense"), { motif, montant })
  }
}
