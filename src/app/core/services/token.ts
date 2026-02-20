import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Token {

  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /* =============================
     TOKEN STORAGE
     ============================= */

  saveToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  clear(): void {
    if (!this.isBrowser()) return;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /* =============================
     JWT DECODE (NO LIB NEEDED)
     ============================= */

  private decodePayload(): any | null {
    if (!this.isBrowser()) return null;

    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /* =============================
     EMAIL (FROM JWT SUBJECT)
     ============================= */

  getEmail(): string {
    const payload = this.decodePayload();
    return payload?.sub || '';
  }

  /* =============================
     ROLE (FROM JWT CLAIM)
     ============================= */

  getRole(): string {
    const payload = this.decodePayload();
    return payload?.role || '';
  }

  /* =============================
     TOKEN EXPIRY CHECK (OPTIONAL)
     ============================= */

  isTokenExpired(): boolean {
    const payload = this.decodePayload();
    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}
