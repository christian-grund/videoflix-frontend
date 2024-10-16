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

  constructor(private dataService: DataService, private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.subscribeCurrentEmail();
    this.removeIntroPlayedCache();
  }

  removeIntroPlayedCache() {
    if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('introPlayed');
    }
  }

  subscribeCurrentEmail() {
    this.dataService.currentEmail.subscribe((email) => (this.email = email));
  }

  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  onSubmit() {
    this.onEmailChange(this.email);
    this.emailError = !this.emailValid;
    this.passwordError = this.password !== this.confirmPassword;

    if (!this.emailError && !this.passwordError) {
      this.dataService.changeEmail(this.email);
      this.register();
    }
  }

  register() {
    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isUserAlreadyRegistered = false;
        this.formSubmitted = true;
      },
      error: (error) => {
        this.message = 'Registration failed: ' + (error.error.non_field_errors ? error.error.non_field_errors[0] : 'Unknown error');
        this.isUserAlreadyRegistered = true;
      },
    });
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
