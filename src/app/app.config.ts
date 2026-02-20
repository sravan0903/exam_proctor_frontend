import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';

// ✅ Import tokens
import { API_URL, AI_URL } from './core/services/app.tokens';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // ✅ Router
    provideRouter(routes),

    // ✅ HttpClient
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),

    // ✅ Register interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // ✅ Provide environment variables
    {
      provide: API_URL,
      useValue: environment.apiUrl
    },
    {
      provide: AI_URL,
      useValue: environment.aiUrl
    },

    // ✅ SSR Hydration
    provideClientHydration(withEventReplay())
  ]
};
