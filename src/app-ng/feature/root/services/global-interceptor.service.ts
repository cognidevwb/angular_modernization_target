import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { RootState } from '../../../root-state';
import { bindMethods } from '../../../bind-methods';
import { ToastService } from '../../../core/toast.service';
import { UserService } from '../../../core/user.service';
import { types as appTypes } from '../../../core/types';
import { $timeout } from '../../../core/q';

/**
 * Ported from the AngularJS factory `globalInterceptor` (module `thingsboard`) in src/app/app.js:107.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class GlobalInterceptorService {
  private readonly __bound = bindMethods(this);
  private readonly rootScope = inject(RootState);

  private toast: any = inject(ToastService);
  private translate: any = inject(TranslateService);
  private userService: any = inject(UserService);
  private types: any = appTypes;
  private http: any = inject(HttpClient);
  private timeout: any = $timeout;
  private internalUrlPrefixes: any = [
        '/api/auth/token',
        '/api/plugins/rpc'
    ];

  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens

  getToast(...rest: any[]): any {
    return this.toast;
  }

  getTranslate(...rest: any[]): any {
    return this.translate;
  }

  getUserService(...rest: any[]): any {
    return this.userService;
  }

  getTypes(...rest: any[]): any {
    return this.types;
  }

  getHttp(...rest: any[]): any {
    return this.http;
  }

  getTimeout(...rest: any[]): any {
    return this.timeout;
  }

  rejectionErrorCode(rejection?: any, ...rest: any[]): any {
    if (rejection && rejection.data && rejection.data.errorCode) {
        return rejection.data.errorCode;
    } else {
        return undefined;
    }
    return undefined;
  }

  isTokenBasedAuthEntryPoint(url?: any, ...rest: any[]): any {
    return  url.startsWith('/api/') &&
           !url.startsWith(this.getTypes().entryPoints.login) &&
           !url.startsWith(this.getTypes().entryPoints.tokenRefresh) &&
           !url.startsWith(this.getTypes().entryPoints.nonTokenBased);
  }

  refreshTokenAndRetry(request?: any, ...rest: any[]): any {
    return this.getUserService().refreshJwtToken().then(() => {
        this.getUserService().updateAuthorizationHeader(request.config.headers);
        return this.getHttp()(request.config);
    }, (message?: any) => {
        this.rootScope.$broadcast('unauthenticated');
        request.status = 401;
        request.data = {};
        request.data.message = message || this.getTranslate().instant('access.unauthorized');
        return Promise.reject(request);
    });
  }

  isInternalUrlPrefix(url?: any, ...rest: any[]): any {
    for (var index in this.internalUrlPrefixes) {
        if (url.startsWith(this.internalUrlPrefixes[index])) {
            return true;
        }
    }
    return false;
  }

  request(config?: any, ...rest: any[]): any {
    var rejected: any = false;
    if (config.url.startsWith('/api/')) {
        var isLoading: any = !this.isInternalUrlPrefix(config.url);
        this.updateLoadingState(config, isLoading);
        if (this.isTokenBasedAuthEntryPoint(config.url)) {
            if (!this.getUserService().updateAuthorizationHeader(config.headers) &&
                !this.getUserService().refreshTokenPending()) {
                this.updateLoadingState(config, false);
                rejected = true;
                this.getUserService().clearJwtToken(false);
                return Promise.reject({ data: {message: this.getTranslate().instant('access.unauthorized')}, status: 401, config: config});
            } else if (!this.getUserService().isJwtTokenValid()) {
                return Promise.reject({ refreshTokenPending: true, config: config });
            }
        }
    }
    if (!rejected) {
        return config;
    }
    return undefined;
  }

  requestError(rejection?: any, ...rest: any[]): any {
    if (rejection.config.url.startsWith('/api/')) {
        this.updateLoadingState(rejection.config, false);
    }
    return Promise.reject(rejection);
  }

  response(response?: any, ...rest: any[]): any {
    if (response.config.url.startsWith('/api/')) {
        this.updateLoadingState(response.config, false);
    }
    return response;
  }

  retryRequest(this: any, httpConfig?: any, ...rest: any[]): any {
    var thisTimeout: any =  1000 + Math.random() * 3000;
    return this.getTimeout()(() => {
        return this.getHttp()(httpConfig);
    }, thisTimeout);
  }

  responseError(rejection?: any, ...rest: any[]): any {
    if (rejection.config.url.startsWith('/api/')) {
        this.updateLoadingState(rejection.config, false);
    }
    var unhandled: any = false;
    var ignoreErrors: any = rejection.config.ignoreErrors;
    var resendRequest: any = rejection.config.resendRequest;
    if (rejection.refreshTokenPending || rejection.status === 401) {
        var errorCode: any = this.rejectionErrorCode(rejection);
        if (rejection.refreshTokenPending || (errorCode && errorCode === this.getTypes().serverErrorCode.jwtTokenExpired)) {
            return this.refreshTokenAndRetry(rejection);
        } else if (errorCode !== this.getTypes().serverErrorCode.credentialsExpired) {
            unhandled = true;
        }
    } else if (rejection.status === 403) {
        if (!ignoreErrors) {
            this.rootScope.$broadcast('forbidden');
        }
    } else if (rejection.status === 429) {
        if (resendRequest) {
            return this.retryRequest(rejection.config);
        }
    } else if (rejection.status === 0 || rejection.status === -1) {
        this.getToast().showError(this.getTranslate().instant('error.unable-to-connect'));
    } else if (!rejection.config.url.startsWith('/api/plugins/rpc')) {
        if (rejection.status === 404) {
            if (!ignoreErrors) {
                this.getToast().showError(rejection.config.method + ": " + rejection.config.url + "<br/>" +
                    rejection.status + ": " + rejection.statusText);
            }
        } else {
            unhandled = true;
        }
    }

    if (unhandled && !ignoreErrors) {
        if (rejection.data && !rejection.data.message) {
            this.getToast().showError(rejection.data);
        } else if (rejection.data && rejection.data.message) {
            this.getToast().showError(rejection.data.message);
        } else {
            this.getToast().showError(this.getTranslate().instant('error.unhandled-error-code', {errorCode: rejection.status}));
        }
    }
    return Promise.reject(rejection);
  }

  updateLoadingState(config?: any, isLoading?: any, ...rest: any[]): any {
    if (!config || (config.ignoreLoading === undefined) || !config.ignoreLoading) {
        this.rootScope.loading = isLoading;
    }
  }
}
