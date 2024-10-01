import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1), // Wir möchten nur die erste Antwort des Observables
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        return router.parseUrl('/login'); // Umleitung zur Login-Seite
      }
    })
  );
};

// export const authGuard: CanActivateFn = async (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   // Warten auf den Authentifizierungsstatus (Promise wird aufgelöst)
//   const isLoggedIn = await authService.isLoggedIn();

//   // Wenn der Benutzer eingeloggt ist, erlaube den Zugriff auf die Seite
//   if (isLoggedIn) {
//     return true;
//   } else {
//     // Wenn nicht eingeloggt, leite zur Login-Seite um
//     return router.parseUrl('/login');
//   }
// };
