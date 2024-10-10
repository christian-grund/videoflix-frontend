import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/';
  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

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

  checkAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      this.isLoggedInSubject.next(!!token);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  isLoggedIn(): Observable<boolean | null> {
    return this.isLoggedInSubject.asObservable();
  }

  activateAccount(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}activate/`, { token });
  }

  passwordResetRequest(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password-reset/', { email });
  }

  passwordResetConfirm(token: string, uid: number, new_password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password-reset-confirm/', {
      token,
      uid,
      new_password,
    });
  }

  checkUserExists(email: string): Observable<any> {
    return this.http.get(`http://localhost:8000/api/users/check-email/?email=${email}`);
  }
}
