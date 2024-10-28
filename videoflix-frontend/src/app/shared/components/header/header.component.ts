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
    this.subscribeToRouteUrl();
  }

  /**
   * Subscribes to the route URL changes and updates the current URL property.
   * Triggers change detection to ensure the view reflects the updated URL.
   */
  subscribeToRouteUrl() {
    this.route.url.subscribe((segments) => {
      this.currentUrl = '/' + segments.map((segment) => segment.path).join('/');
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Logs out the current user by calling the logout service.
   * Clears the stored token, navigates to the home page, and reloads the page.
   */
  logout() {
    this.authService
      .logout()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
        setTimeout(() => {
          location.reload();
        }, 0);
      })
      .catch((error) => {
        this.message = 'Logout failed: ' + (error.error ? error.error : 'Unknown error');
      });
  }

  /**
   * Opens a popup for adding a new video using the video popup service.
   */
  openAddVideoPopup() {
    this.videoPopupService.openAddVideoPopup();
  }
}
