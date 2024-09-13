import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  currentUrl: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.url.subscribe((segments) => {
      this.currentUrl = '/' + segments.map((segment) => segment.path).join('/');
      this.changeDetectorRef.detectChanges(); // Hier wird die Change Detection ausgelöst
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        localStorage.removeItem('token');
        this.message = 'Logout successful!';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.message =
          'Logout failed: ' + (error.error ? error.error : 'Unknown error');
      },
    });
  }
}
