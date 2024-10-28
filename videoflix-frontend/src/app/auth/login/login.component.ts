import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';
  showPassword: boolean = false;
  matchError: boolean = false;
  isRememberMeChecked: boolean = false;
  isUserRegistered: boolean = true;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.removeIntroPlayedCache();
    this.dataService.currentEmail.subscribe((email) => (this.email = email));
    this.checkSavedCredentials();
  }

  /**
   * Removes the 'introPlayed' item from local storage if running in a browser environment.
   */
  removeIntroPlayedCache() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('introPlayed');
    }
  }

  /**
   * Handles the login process by checking if the user is registered,
   * authenticating the user, and managing the token and navigation upon success.
   */
  async login() {
    await this.checkUserRegistered();
    if (this.isUserRegistered) {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          this.matchError = false;
          localStorage.setItem('token', response.token);
          this.authService.checkAuthStatus();
          setTimeout(() => {
            this.router.navigate(['/videos']);
          }, 100);
        },
        error: (error) => {
          this.message = 'Login failed: ' + (error.error.non_field_errors ? error.error.non_field_errors[0] : 'Unknown error');
          this.matchError = true;
        },
      });
      this.checkRememberMe();
    }
  }

  /**
   * Saves or deletes user credentials in local storage based on the 'Remember Me' checkbox status.
   */
  checkRememberMe() {
    if (this.isRememberMeChecked) {
      this.saveCredentials();
    } else {
      this.deleteCredentials();
    }
  }

  /**
   * Checks if the user is registered by verifying the email with the authentication service.
   */
  async checkUserRegistered() {
    this.authService.checkUserExists(this.email).subscribe({
      next: (response) => {
        console.log('checkUserRegistered', response);
        if (response.exists) {
          this.isUserRegistered = true;
        }
      },
      error: () => {
        this.isUserRegistered = false;
      },
    });
  }

  /**
   * Saves the user's email and password to local storage for future use.
   */
  saveCredentials() {
    let credentials = JSON.stringify({
      email: this.email,
      password: this.password,
    });
    localStorage.setItem('credentials', credentials);
  }

  /**
   * Deletes the saved user credentials from local storage.
   */
  deleteCredentials() {
    localStorage.removeItem('credentials');
  }

  /**
   * Checks and populates the email and password fields with saved credentials from local storage.
   */
  checkSavedCredentials() {
    if (typeof localStorage !== 'undefined') {
      const savedCredentials = localStorage.getItem('credentials');

      if (savedCredentials) {
        const { email, password } = JSON.parse(savedCredentials);
        this.email = email;
        this.password = password;
        this.isRememberMeChecked = true;
      }
    }
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
