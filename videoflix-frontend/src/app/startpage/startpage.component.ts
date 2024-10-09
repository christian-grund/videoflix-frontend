import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.isIntroPlaying = true;

    setTimeout(() => {
      this.isIntroPlaying = false;
    }, 4000);
  }

  onEmailChange(value: string) {
    this.email = value;
    this.emailValid = this.validateEmail(value);
  }

  onSubmit() {
    if (this.emailValid) {
      console.log('emailValid:', this.emailValid);
      this.emailError = false;
      this.dataService.changeEmail(this.email);
      this.router.navigate(['/signup']);
    } else {
      console.log('Invalid email');
      this.emailError = true;
      console.log('emailError:', this.emailError);
    }
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
