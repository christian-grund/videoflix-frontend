import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token'; // Schlüssel für den Token im LocalStorage

  private apiUrl = 'http://localhost:8000/'; // Dein Backend-Endpunkt

  constructor(private http: HttpClient) {}

  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'signup/', user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'login/', { email, password });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    return this.http.post<any>(`${this.apiUrl}logout/`, {}, { headers });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token; // Gibt true zurück, wenn ein Token existiert, andernfalls false
  }
  // isAuthenticated() {
  //   throw new Error('Method not implemented.');
  // }

  activateAccount(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}activate/`, { token });
  }
}
