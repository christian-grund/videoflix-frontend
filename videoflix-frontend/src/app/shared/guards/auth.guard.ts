import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

/**
 * Auth guard to protect routes by checking if the user is logged in.
 *
 * If the user is logged in, it allows access to the route.
 * Otherwise, it redirects to the login page.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        return router.parseUrl('/login');
      }
    })
  );
};
