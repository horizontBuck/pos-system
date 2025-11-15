import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthPocketbaseService } from './services/auth-pocketbase.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthPocketbaseService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
