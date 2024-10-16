import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss',
})
export class ForgotpasswordComponent {
  email: string = '';
  emailValid: boolean = false;
  emailError: boolean = false;
  formSubmitted: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.emailError = !this.emailValid;
    this.passwordResetRequest();
  }

  /**
   * Sends a password reset request using the entered email and updates the form submission state accordingly.
   */
  passwordResetRequest() {
    this.authService.passwordResetRequest(this.email).subscribe({
      next: (response) => {
        this.formSubmitted = true;
      },
      error: (error) => {
        console.error('Password reset did not work', error);
        this.formSubmitted = false;
      },
    });
  }

  /**
   * Updates the email value and checks its validity.
   * @param {string} value - The email input value.
   */
  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  /**
   * Validates the format of the provided email address.
   * @param {string} email - The email address to validate.
   * @returns {boolean} - True if the email is valid, false otherwise.
   */
  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
