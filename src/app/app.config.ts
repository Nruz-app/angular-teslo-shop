import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from '@shared/interceptors/logging.intercerptor';
import { authInterceptor } from '@auth/interceptors/auth.interceptos';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withHashLocation() // #/home
    ),
    provideHttpClient(
      withFetch(),
      //se Importar los Interceptos app/app.config.ts
      withInterceptors([
        loggingInterceptor,
        authInterceptor
      ])
    )
  ]
};
