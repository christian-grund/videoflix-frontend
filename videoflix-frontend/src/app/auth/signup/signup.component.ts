import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  emailValid: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;
  showPassword: boolean = false;
  formSubmitted: boolean = false;
  isUserAlreadyRegistered: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.subscribeCurrentEmail();
    this.removeIntroPlayedCache();
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
   * Subscribes to the current email from the data service and updates the component's email property.
   */
  subscribeCurrentEmail() {
    this.dataService.currentEmail.subscribe((email) => (this.email = email));
  }

  /**
   * Updates the email property and checks if the email format is valid.
   * @param {string} value - The email input value.
   */
  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  /**
   * Validates the email and password fields on form submission.
   * If both fields are valid, it changes the email and proceeds with registration.
   */
  onSubmit() {
    this.onEmailChange(this.email);
    this.emailError = !this.emailValid;
    this.passwordError = this.password !== this.confirmPassword;

    if (!this.emailError && !this.passwordError) {
      this.dataService.changeEmail(this.email);
      this.register();
    }
  }

  /**
   * Registers a new user with the provided email and password.
   * Updates the component's state based on the registration result.
   */
  register() {
    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isUserAlreadyRegistered = false;
        this.formSubmitted = true;
      },
      error: (error) => {
        console.error('Registration failed: Full error object:', error);
        console.error('Registration failed: Error message:', error.message);
        if (error.error) {
          console.error('Registration failed: Error details:', error.error);
        }
        this.isUserAlreadyRegistered = true;
      },
    });
  }

  /**
   * Validates the email format using a regular expression.
   * @param {string} email - The email to validate.
   * @returns {boolean} True if the email is valid, otherwise false.
   */
  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
