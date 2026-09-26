import { HttpContext, HttpContextToken, HttpHeaders, HttpParams } from '@angular/common/http';

/** `$http(config)` flags the legacy interceptor read, carried on the request's context. */
export const IGNORE_LOADING = new HttpContextToken<boolean>(() => false);
export const IGNORE_ERRORS = new HttpContextToken<boolean>(() => false);
export const RESEND_REQUEST = new HttpContextToken<boolean>(() => false);

/**
 * HttpClient options from an AngularJS `$http` config: headers, params and
 * responseType as HttpClient takes them, and the app's own flags
 * (`ignoreLoading`, `ignoreErrors`, `resendRequest`) on the context.
 */
export function httpOptions(config?: any): any {
  const context = new HttpContext()
    .set(IGNORE_LOADING, !!config?.ignoreLoading)
    .set(IGNORE_ERRORS, !!config?.ignoreErrors)
    .set(RESEND_REQUEST, !!config?.resendRequest);
  const options: any = { context };
  if (config?.headers) {
    options.headers = config.headers instanceof HttpHeaders ? config.headers : new HttpHeaders(config.headers);
  }
  if (config?.params) {
    options.params = config.params instanceof HttpParams ? config.params : new HttpParams({ fromObject: config.params });
  }
  if (config?.responseType) {
    options.responseType = config.responseType === 'arraybuffer' ? 'arraybuffer' : config.responseType;
  }
  if (config?.observe) {
    options.observe = config.observe;
  }
  return options;
}
