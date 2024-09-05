import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DataService } from '../../shared/services/data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  @ViewChild('form') form!: NgForm;

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  emailValid: boolean = false;
  emailError: boolean = false;
  passwordError: boolean = false;
  showPassword: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.currentEmail.subscribe((email) => (this.email = email));
  }

  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  onSubmit() {
    this.emailError = !this.emailValid;

    this.passwordError = this.password !== this.confirmPassword;

    if (!this.emailError && !this.passwordError) {
      console.log('Form valid!');
    } else {
      if (this.emailError) {
        console.log('Invalid email');
      }
      if (this.passwordError) {
        console.log('passwordError:', this.passwordError);
      }
    }
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
