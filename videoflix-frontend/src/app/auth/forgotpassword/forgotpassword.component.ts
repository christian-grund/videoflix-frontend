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
    this.authService.passwordResetRequest(this.email).subscribe({
      next: (response) => {
        console.log('Password reset success!', response);
        this.formSubmitted = true;
      },
      error: (error) => {
        console.log('Password reset did not work', error);
        this.formSubmitted = false;
      },
    });
  }

  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
