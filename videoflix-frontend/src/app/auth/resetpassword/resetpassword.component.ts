import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss',
})
export class ResetpasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  matchError: boolean = false;
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  token: string | null = null;
  uid: number | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onSubmit() {
    this.matchError = !this.passwordMatch();
    this.checkQueryParams();
  }

  /**
   * Subscribes to query parameters to retrieve the password reset token and user ID.
   * If both values are present, it attempts to confirm the password reset.
   */
  checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.uid = parseInt(params['uid'], 10);
      if (this.token && this.uid) {
        this.authService.passwordResetConfirm(this.token, this.uid, this.password).subscribe({
          next: () => {
            this.formSubmitted = true;
          },
          error: () => {
            this.formSubmitted = false;
          },
        });
      }
    });
  }

  /**
   * Checks if the password and confirm password fields match.
   * @returns {boolean} True if the passwords match, otherwise false.
   */
  passwordMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
