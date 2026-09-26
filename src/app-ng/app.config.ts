import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideTranslateCompiler, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { PUBLIC_PATH } from './app-globals';
import { authGuard } from './core/auth.guard';
import { authInterceptor } from './core/auth.interceptor';
import { LegacyTranslateCompiler } from './core/translate-compiler';

// The legacy app.config, as Angular providers: html5 URLs (the Router's
// default), the global interceptor, the static-file translations with en_US as
// the fallback (angular-translate's useStaticFilesLoader / fallbackLanguage),
// the `mdi` icon set ($mdIconProvider.iconSet('mdi', …): `svgIcon="mdi:…"`) and the two extra shapes
// (ngMdIconServiceProvider.addShape). Every route passes the guard that
// app.run's $stateChangeStart handler was.
//
// Every component declares `changeDetection: ChangeDetectionStrategy.Eager`: Angular 22 makes OnPush the
// default, and the ported screens change plain fields from promises and events as the AngularJS digest let
// them, so each is checked on every pass (as a digest checked every watcher).

/** app.config's `ngMdIconServiceProvider.addShape(...)`: icons the datasource key chips show (`svgIcon="alpha-a-circle-outline"`). */
const EXTRA_ICON_SHAPES: Record<string, string> = {
  'alpha-a-circle-outline':
    '<path d="M11,7H13A2,2 0 0,1 15,9V17H13V13H11V17H9V9A2,2 0 0,1 11,7M11,9V11H13V9H11M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z" />',
  'alpha-e-circle-outline':
    '<path d="M9,7H15V9H11V11H15V13H11V15H15V17H9V7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />',
};

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
      compiler: provideTranslateCompiler(LegacyTranslateCompiler),
      fallbackLang: 'en_US',
      lang: preferredLanguage(),
    }),
    provideAppInitializer(() => {
      const sanitizer = inject(DomSanitizer);
      const icons = inject(MatIconRegistry)
        .setDefaultFontSetClass('material-icons')
        .addSvgIconSetInNamespace('mdi', sanitizer.bypassSecurityTrustResourceUrl(PUBLIC_PATH + 'svg/mdi.svg'));
      for (const [name, path] of Object.entries(EXTRA_ICON_SHAPES)) {
        icons.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${path}</svg>`));
      }
    }),
  ],
};
