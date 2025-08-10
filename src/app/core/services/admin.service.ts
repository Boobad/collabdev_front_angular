import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import type { Observable } from "rxjs";
import { API_BASE_URL, buildHttpParams } from "./api.config";
import type {
  Badge,
  BulkValidationRequest,
  CoinConfig,
  MessageResponse,
  Page,
  Project,
  User,
} from "../types/api.models";

@Injectable({ providedIn: "root" })
export class AdminService {
  private base = `${API_BASE_URL}/admin`;

  constructor(private http: HttpClient) {}

  // Dashboard stats
  stats(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.base}/stats`);
  }

  recentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/activity`);
  }

  // Projects validation
  listPendingProjects(params?: { page?: number; size?: number }): Observable<Page<Project>> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Page<Project>>(`${this.base}/projects/validation`, { params: httpParams });
  }

  bulkValidateProjects(payload: BulkValidationRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.base}/projects/validation`, payload);
  }

  // Badges CRUD with stats
  listBadges(params?: { page?: number; size?: number }): Observable<Page<Badge>> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Page<Badge>>(`${this.base}/badges`, { params: httpParams });
  }

  createBadge(badge: Badge): Observable<Badge> {
    return this.http.post<Badge>(`${this.base}/badges`, badge);
  }

  updateBadge(id: number | string, patch: Partial<Badge>): Observable<Badge> {
    return this.http.put<Badge>(`${this.base}/badges/${id}`, patch);
  }

  deleteBadge(id: number | string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.base}/badges/${id}`);
  }

  // Coins economy settings
  getCoinConfig(): Observable<CoinConfig> {
    return this.http.get<CoinConfig>(`${this.base}/coins`);
  }

  updateCoinConfig(config: CoinConfig): Observable<CoinConfig> {
    return this.http.put<CoinConfig>(`${this.base}/coins`, config);
  }

  // Users moderation
  listUsers(params?: { page?: number; size?: number; q?: string; role?: string }): Observable<Page<User>> {
    const httpParams = buildHttpParams(params);
    return this.http.get<Page<User>>(`${this.base}/users`, { params: httpParams });
  }

  moderateUser(userId: number | string, action: "ban" | "unban"): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.base}/users/${userId}/${action}`, {});
  }
}
