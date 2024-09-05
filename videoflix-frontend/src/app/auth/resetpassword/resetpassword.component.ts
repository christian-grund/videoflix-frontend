import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss',
})
export class ResetpasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  matchError: boolean = false;

  onSubmit() {
    this.matchError = !this.passwordMatch(); // Setzt den matchError direkt basierend auf dem Vergleich
    console.log('passwordMatch:', !this.matchError); // Zeigt das Gegenteil von matchError an
  }

  passwordMatch(): boolean {
    return this.password === this.confirmPassword; // Direkter Vergleich mit Rückgabewert
  }
}
