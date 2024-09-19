import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss',
})
export class ActivateComponent implements OnInit {
  private token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['key'];
      if (this.token) {
        this.authService.activateAccount(this.token).subscribe({
          next: (response) => {
            console.log('Registrierung erfolgreich!');
          },
          error: (error) => {
            console.error('Activation error', error);
          },
          complete: () => {
            console.log('Activation request completed');
          },
        });
      }
    });
  }
}
