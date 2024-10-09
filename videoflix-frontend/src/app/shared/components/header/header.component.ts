import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VideoPopupService } from '../../services/videopopup.service';

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
    private videoPopupService: VideoPopupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.url.subscribe((segments) => {
      this.currentUrl = '/' + segments.map((segment) => segment.path).join('/');
      this.changeDetectorRef.detectChanges();
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        localStorage.removeItem('token');
        this.message = 'Logout successful!';
        this.router.navigate(['/']);
        setTimeout(() => {
          location.reload();
        }, 0);
      },
      error: (error) => {
        this.message = 'Logout failed: ' + (error.error ? error.error : 'Unknown error');
      },
    });
  }

  openAddVideoPopup() {
    this.videoPopupService.openAddVideoPopup();
  }
}
