import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Auth guard to protect routes by checking if the user is logged in.
 *
 * If the user is logged in, it allows access to the route.
 * Otherwise, it redirects to the login page.
 */
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  static canActivate: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/home']);
      return false;
    }
  };
}
