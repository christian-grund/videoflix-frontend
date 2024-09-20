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

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          resolve(!!localStorage.getItem('token'));
        } else {
          resolve(false);
        }
      }, 100); // 100 ms Verzögerung
    });
  }

  activateAccount(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}activate/`, { token });
  }

  passwordResetRequest(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password-reset/', { email });
  }

  passwordResetConfirm(
    token: string,
    uid: number,
    new_password: string
  ): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password-reset-confirm/', {
      token,
      uid,
      new_password,
    });
  }
}
