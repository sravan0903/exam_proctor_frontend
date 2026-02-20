import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../services/token';

export const roleGuard: CanActivateFn = (route): boolean | UrlTree => {

  const tokenService = inject(Token);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  const expectedRole = route.data['role'];

  // ✅ Allow SSR render
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const userRole = tokenService.getRole();

  // ✅ Role match
  if (expectedRole && userRole === expectedRole) {
    return true;
  }

  // ✅ Redirect using UrlTree (NOT navigate)
  if (userRole === 'ADMIN') {
    return router.createUrlTree(['/admin']);
  }
  if (userRole === 'EXAMINER') {
    return router.createUrlTree(['/examiner']);
  }
  if (userRole === 'STUDENT') {
    return router.createUrlTree(['/student']);
  }

  return router.createUrlTree(['/auth/login']);
};
