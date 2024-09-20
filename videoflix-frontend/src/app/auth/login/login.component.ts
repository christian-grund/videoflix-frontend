import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

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
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';
  showPassword: boolean = false;
  matchError: boolean = false;
  isRememberMeChecked: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.currentEmail.subscribe((email) => (this.email = email));

    this.checkSavedCredentials();
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.matchError = false;
        localStorage.setItem('token', response.token);
        this.message = 'Login successful!';
        this.router.navigate(['/videos']);
      },
      error: (error) => {
        this.message =
          'Login failed: ' +
          (error.error.non_field_errors
            ? error.error.non_field_errors[0]
            : 'Unknown error');
        this.matchError = true;
      },
    });

    if (this.isRememberMeChecked) {
      this.saveCredentials();
    } else {
      this.deleteCredentials();
    }
  }

  saveCredentials() {
    let credentials = JSON.stringify({
      email: this.email,
      password: this.password,
    });
    localStorage.setItem('credentials', credentials);
  }

  deleteCredentials() {
    localStorage.removeItem('credentials');
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
