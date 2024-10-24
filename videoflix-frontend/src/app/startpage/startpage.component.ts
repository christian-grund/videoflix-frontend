import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-startpage',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.scss',
})
export class StartpageComponent implements OnInit {
  email: string = '';
  emailValid: boolean = false;
  emailError: boolean = false;
  isIntroPlaying: boolean = false;

  constructor(private router: Router, private dataService: DataService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.checkIntroPlayed();
  }

  /**
   * Checks if the introductory animation has been played.
   */
  checkIntroPlayed() {
    if (isPlatformBrowser(this.platformId)) {
      const introPlayed = localStorage.getItem('introPlayed');

      if (!introPlayed) {
        this.isIntroPlaying = true;
        setTimeout(() => {
          this.isIntroPlaying = false;
          localStorage.setItem('introPlayed', 'true');
        }, 3000);
      } else {
        this.isIntroPlaying = false;
      }
    }
  }

  /**
   * Handles the change of the email input field.
   * Updates the email property and validates the email format.
   *
   * @param {string} value - The new value of the email input field.
   */
  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  /**
   * Submits the email for processing.
   * If the email is valid, it navigates to the signup page.
   * Otherwise, it sets an error flag.
   */
  onSubmit() {
    if (this.emailValid) {
      this.emailError = false;
      this.dataService.changeEmail(this.email);
      this.router.navigate(['/signup']);
    } else {
      this.emailError = true;
    }
  }

  /**
   * Validates the format of the provided email string.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} True if the email format is valid, false otherwise.
   */
  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
