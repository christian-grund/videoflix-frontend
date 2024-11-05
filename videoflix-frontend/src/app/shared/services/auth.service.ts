import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, filter, lastValueFrom, mapTo, Observable, of, take, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'http://localhost:8000/';
  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);
  private loggedIn$ = new BehaviorSubject<boolean | null>(null);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * Registers a new user with the specified email and password.
   *
   * @param {Object} user - The user data for registration.
   * @param {string} user.email - The email address of the user.
   * @param {string} user.password - The password for the user.
   * @returns {Observable<any>} An observable containing the server response.
   */
  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'signup/', user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Logs in a user with the provided email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Observable<any>} An observable containing the server response.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'login/', { email, password });
  }

  /**
   * Logs out the currently authenticated user.
   *
   * @returns {Promise<void>} A promise containing the server response.
   */
  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    // return this.http.post<any>(`${this.apiUrl}logout/`, {}, { headers });
    await lastValueFrom(this.http.post<any>(`${this.apiUrl}logout/`, {}, { headers }));
  }

  isLoggedIn(): boolean {
    let tokenExists: boolean = false;
    if (isPlatformBrowser(this.platformId)) {
      tokenExists = !!localStorage.getItem('token');
    }
    return tokenExists;
  }

  // /**
  //  * Checks the authentication status of the user.
  //  * Updates the logged-in state based on the presence of a token in local storage.
  //  */
  checkAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      this.isLoggedInSubject.next(!!token);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  /**
   * Activates a user account using the provided token.
   *
   * @param {string} token - The activation token sent to the user's email.
   * @returns {Observable<any>} An observable containing the server response.
   */
  activateAccount(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}activate/`, { token });
  }

  /**
   * Requests a password reset for the user with the specified email.
   *
   * @param {string} email - The email address of the user requesting the reset.
   * @returns {Observable<any>} An observable containing the server response.
   */
  passwordResetRequest(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password-reset/', { email });
  }

  /**
   * Confirms the password reset with the given token, user ID, and new password.
   *
   * @param {string} token - The password reset token.
   * @param {number} uid - The user ID associated with the token.
   * @param {string} new_password - The new password for the user.
   * @returns {Observable<any>} An observable containing the server response.
   */
  passwordResetConfirm(token: string, uid: number, new_password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password-reset-confirm/', {
      token,
      uid,
      new_password,
    });
  }

  /**
   * Checks if a user exists with the specified email address.
   *
   * @param {string} email - The email address to check.
   * @returns {Observable<any>} An observable containing the response indicating whether the user exists.
   */
  checkUserExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}api/users/check-email/?email=${email}`);
  }
}
