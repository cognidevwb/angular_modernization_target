import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from, throwError, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../feature/api/services/user.service';
import { types } from '../feature/common/constants/types';
import { ToastService } from '../feature/services/toast.service';
import { RootState } from '../root-state';
import { store } from './app-store';
import { IGNORE_ERRORS, IGNORE_LOADING, RESEND_REQUEST } from './http-options';

/**
 * The legacy `globalInterceptor` ($httpProvider.interceptors), as an Angular
 * interceptor: every `/api/` request sets `rootScope.loading`, carries the JWT
 * (`X-Authorization: Bearer …`), refreshes an expired token and retries once,
 * and turns an error into the toast or the app event the legacy code showed.
 */
const INTERNAL_URL_PREFIXES = ['/api/auth/token', '/api/plugins/rpc'];

function isTokenBasedAuthEntryPoint(url: string): boolean {
  return url.startsWith('/api/') && !url.startsWith(types.entryPoints.login) && !url.startsWith(types.entryPoints.tokenRefresh) && !url.startsWith(types.entryPoints.nonTokenBased);
}

function withToken(req: HttpRequest<unknown>): HttpRequest<unknown> {
  const token = store.get('jwt_token');
  return token ? req.clone({ setHeaders: { 'X-Authorization': 'Bearer ' + token } }) : req;
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }
  const users = inject(UserService);
  const rootScope = inject(RootState);
  const translate = inject(TranslateService);
  const toast = inject(ToastService);
  const ignoreLoading = req.context.get(IGNORE_LOADING);
  const ignoreErrors = req.context.get(IGNORE_ERRORS);
  const setLoading = (loading: boolean) => {
    if (!ignoreLoading) {
      rootScope['loading'] = loading;
    }
  };

  const refreshAndRetry = (): Observable<HttpEvent<unknown>> =>
    from(Promise.resolve(users.refreshJwtToken())).pipe(
      switchMap(() => next(withToken(req))),
      catchError((message: any) => {
        if (message instanceof HttpErrorResponse) {
          return throwError(() => message);
        }
        rootScope.$broadcast('unauthenticated');
        return throwError(() => new HttpErrorResponse({ status: 401, url: req.url, error: { message: message || translate.instant('access.unauthorized') } }));
      }),
    );

  const handleError = (error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
    setLoading(false);
    let unhandled = false;
    if (error.status === 401) {
      const errorCode = error.error?.errorCode;
      if (errorCode === types.serverErrorCode.jwtTokenExpired) {
        return refreshAndRetry();
      } else if (errorCode !== types.serverErrorCode.credentialsExpired) {
        unhandled = true;
      }
    } else if (error.status === 403) {
      if (!ignoreErrors) {
        rootScope.$broadcast('forbidden');
      }
    } else if (error.status === 429) {
      if (req.context.get(RESEND_REQUEST)) {
        return timer(1000 + Math.random() * 3000).pipe(switchMap(() => next(withToken(req))));
      }
    } else if (error.status === 0 || error.status === -1) {
      toast.showError(translate.instant('error.unable-to-connect'));
    } else if (!req.url.startsWith('/api/plugins/rpc')) {
      if (error.status === 404) {
        if (!ignoreErrors) {
          toast.showError(req.method + ': ' + req.url + '<br/>' + error.status + ': ' + error.statusText);
        }
      } else {
        unhandled = true;
      }
    }
    if (unhandled && !ignoreErrors) {
      if (error.error && !error.error.message) {
        toast.showError(error.error);
      } else if (error.error?.message) {
        toast.showError(error.error.message);
      } else {
        toast.showError(translate.instant('error.unhandled-error-code', { errorCode: error.status }));
      }
    }
    return throwError(() => error);
  };

  setLoading(!INTERNAL_URL_PREFIXES.some((p) => req.url.startsWith(p)));
  if (isTokenBasedAuthEntryPoint(req.url)) {
    if (!store.get('jwt_token') && !users.refreshTokenPending()) {
      setLoading(false);
      users.clearJwtToken(false);
      return throwError(() => new HttpErrorResponse({ status: 401, url: req.url, error: { message: translate.instant('access.unauthorized') } }));
    } else if (!users.isJwtTokenValid()) {
      return refreshAndRetry().pipe(tap({ next: (e) => e instanceof HttpResponse && setLoading(false), error: () => setLoading(false) }));
    }
  }
  return next(withToken(req)).pipe(
    tap((e) => {
      if (e instanceof HttpResponse) {
        setLoading(false);
      }
    }),
    catchError(handleError),
  );
};
