import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

// Generated deterministically (scaffold-app) for Angular 22.
// Modern providers: zone-based change detection (zoneless is adopted last), standalone Router with input binding, and the
// fetch-based HttpClient (never HttpClientModule). Add app providers here.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};
