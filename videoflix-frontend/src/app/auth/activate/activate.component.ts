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

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subscribeQueryParams();
  }

  /**
   * Subscribes to route query parameters and activates the user account using the 'key' parameter if present.
   */
  subscribeQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['key'];
      if (this.token) {
        this.authService.activateAccount(this.token).subscribe({
          error: (error) => {
            console.error('Activation error', error);
          },
        });
      }
    });
  }
}
