import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrangeMoneyService {
  private backendUrl = 'https://e8c1f9829683.ngrok-free.app';

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string | null> {
    try {
      const res: any = await firstValueFrom(this.http.post(`${this.backendUrl}/api/orange-token`, {}));
      return res.access_token;
    } catch (err) {
      console.error('Erreur accès token', err);
      return null;
    }
  }

  async createTransaction(params: any): Promise<any> {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.backendUrl}/api/orange-transaction`, { token, transactionData: params })
      );
      return res;
    } catch (err) {
      console.error('Erreur création transaction', err);
      return null;
    }
  }
}
