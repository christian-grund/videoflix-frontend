import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedIn(); // Auflösung des Promises
  if (isLoggedIn) {
    return true;
  } else {
    return router.parseUrl('/login'); // Umleitung zur Login-Seite
  }
};
