import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthPocketbaseService } from './services/auth-pocketbase.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthPocketbaseService);
  const router = inject(Router);

  // Si no hay sesión válida → redirigir al login
  if (!auth.isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
