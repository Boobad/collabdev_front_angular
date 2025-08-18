import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private contributeursUrl = 'http://localhost:8080/api/v1/contributeurs';
  private adminsUrl = 'http://localhost:8080/api/v1/administrateurs';

  constructor(private http: HttpClient) {}


  getContributeurs(): Observable<any[]> {
    return this.http.get<any[]>(this.contributeursUrl);
  }

  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(this.adminsUrl);
  }
}
