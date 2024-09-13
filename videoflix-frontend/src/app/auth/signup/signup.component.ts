import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
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

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      console.log('Form valid!');
      this.dataService.changeEmail(this.email);
      this.register();
    } else {
      if (this.emailError) {
        console.log('Invalid email');
      }
      if (this.passwordError) {
        console.log('passwordError:', this.passwordError);
      }
    }
  }

  register() {
    this.authService
      .register({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.message = 'User registered successfully!';
          this.router.navigate(['/login']);
        },
        error: (error) => {
          // Falls `non_field_errors` nicht vorhanden ist, zeige eine allgemeine Fehlermeldung an
          this.message =
            'Registration failed: ' +
            (error.error.non_field_errors
              ? error.error.non_field_errors[0]
              : 'Unknown error');
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
