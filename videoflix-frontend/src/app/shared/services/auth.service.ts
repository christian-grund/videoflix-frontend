import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token'; // Schlüssel für den Token im LocalStorage
  private apiUrl = 'http://localhost:8000/'; // Dein Backend-Endpunkt
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
    console.log('Checking auth status...');
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('Token in localStorage:', token);
      this.isLoggedInSubject.next(!!token); // true, wenn Token vorhanden, false wenn nicht
    } else {
      this.isLoggedInSubject.next(false); // Auf dem Server false
    }
  }

  isLoggedIn(): Observable<boolean | null> {
    return this.isLoggedInSubject.asObservable();
  }

  // isLoggedIn(): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     // Wenn wir uns im Browser befinden, prüfen wir den token
  //     if (typeof window !== 'undefined') {
  //       const token = localStorage.getItem('token');
  //       resolve(!!token); // true, wenn token vorhanden ist
  //     } else {
  //       resolve(false); // false, wenn auf dem Server
  //     }
  //   });
  // }

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
}
