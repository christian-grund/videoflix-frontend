import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';
  showPassword: boolean = false;
  matchError: boolean = false;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.message = 'Login successful!';
      },
      error: (error) => {
        // Falls `non_field_errors` nicht vorhanden ist, zeige eine allgemeine Fehlermeldung an
        this.message =
          'Login failed: ' +
          (error.error.non_field_errors
            ? error.error.non_field_errors[0]
            : 'Unknown error');
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
