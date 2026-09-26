import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { PUBLIC_PATH } from './app-globals';
import { authGuard } from './core/auth.guard';
import { authInterceptor } from './core/auth.interceptor';

// The legacy app.config, as Angular providers: html5 URLs (the Router's
// default), the global interceptor, the static-file translations with en_US as
// the fallback (angular-translate's useStaticFilesLoader / fallbackLanguage),
// and the `mdi` icon set ($mdIconProvider.iconSet). Every route passes the
// guard that app.run's $stateChangeStart handler was.
function preferredLanguage(): string {
  const stored = localStorage.getItem('NG_TRANSLATE_LANG_KEY');
  if (stored) {
    return stored.replace(/"/g, '');
  }
  const browser = (navigator.language || 'en-US').replace('-', '_');
  return /^[a-z]{2}_[A-Z]{2}$/.test(browser) ? browser : 'en_US';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes.map((r) => (r.redirectTo || r.path === '**' ? r : { ...r, canActivate: [authGuard], children: r.children?.map((c) => (c.redirectTo ? c : { ...c, canActivate: [authGuard] })) })),
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: PUBLIC_PATH + 'locale/locale.constant-', suffix: '.json' }),
      fallbackLang: 'en_US',
      lang: preferredLanguage(),
    }),
    provideAppInitializer(() => {
      inject(MatIconRegistry)
        .setDefaultFontSetClass('material-icons')
        .addSvgIconSet(inject(DomSanitizer).bypassSecurityTrustResourceUrl(PUBLIC_PATH + 'svg/mdi.svg'));
    }),
  ],
};
