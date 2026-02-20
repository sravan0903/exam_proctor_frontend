import { Injectable, inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Notify {
   private platformId = inject(PLATFORM_ID);

  success(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      console.log('✅', message);
    }
  }

  error(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      console.error('❌', message);
    }
  }
}
