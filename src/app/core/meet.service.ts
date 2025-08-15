import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MeetService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

createMeet(title: string, emails: string[], start: string, end: string) {
  return this.http.post<{ meetLink: string }>(
    `${this.apiUrl}/create-meet`, 
    { projectTitle: title, participants: emails, startTime: start, endTime: end }
  );
}


}
