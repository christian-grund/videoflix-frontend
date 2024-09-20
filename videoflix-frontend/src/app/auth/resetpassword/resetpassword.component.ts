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
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
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

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.matchError = !this.passwordMatch(); // Setzt den matchError direkt basierend auf dem Vergleich
    console.log('passwordMatch:', !this.matchError); // Zeigt das Gegenteil von matchError an

    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.uid = parseInt(params['uid'], 10);
      if (this.token && this.uid) {
        this.authService
          .passwordResetConfirm(this.token, this.uid, this.password)
          .subscribe({
            next: (response) => {
              console.log('Password successfuly changed', response);
              this.formSubmitted = true;
            },
            error: (error) => {
              console.error('An error occured:', error);
              this.formSubmitted = false;
            },
          });
      }
    });
  }

  passwordMatch(): boolean {
    return this.password === this.confirmPassword; // Direkter Vergleich mit Rückgabewert
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
