import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/'; // Dein Backend-Endpunkt

  constructor(private http: HttpClient) {}

  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'signup/', user);
  }
}
