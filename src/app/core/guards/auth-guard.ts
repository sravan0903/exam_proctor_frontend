import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../services/token';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {

  const tokenService = inject(Token);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ Allow SSR render
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // ✅ Browser-only auth check
  return tokenService.isLoggedIn()
    ? true
    : router.createUrlTree(['/auth/login']);
};
