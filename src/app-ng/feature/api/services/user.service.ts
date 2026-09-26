import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { AdminService } from './admin.service';
import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { TimeService } from './time.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
import { store } from '../../../core/app-store';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let jwtHelper: any;

/**
 * Ported from the AngularJS factory `userService` (module `thingsboard.api.user`) in src/app/api/user.service.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 6 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly rootScope = inject(RootState);
  private readonly translate = inject(TranslateService);
  private readonly adminService = inject(AdminService);
  private readonly dashboardService = inject(DashboardService);
  // TODO(port): 'jwtHelper' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  private readonly loginService = inject(LoginService);
  // TODO(port): 'store' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  private readonly timeService = inject(TimeService);
  private readonly toast = inject(ToastService);

  private currentUser: any = null;
  private currentUserDetails: any = null;
  private lastPublicDashboardId: any = null;
  private allowedDashboardIds: any = [];
  private redirectParams: any = null;
  private userTokenAccessEnabled: any = false;
  private userLoaded: any = false;
  private refreshTokenQueue: any = [];

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $location.search — $location.search: this.route.snapshot.queryParams
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    this.reloadUser();
  }

  reloadUser(...rest: any[]): any {
    this.userLoaded = false;
    this.loadUser(true).then(() => {
        this.notifyUserLoaded();
    }, () => {
        this.notifyUserLoaded();
    });
  }

  private decodeToken(token: any): any {
    if (!token) {
        return null;
    }
    const parts = String(token).split('.');
    if (parts.length !== 3) {
        return null;
    }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  }

  updateAndValidateToken(token?: any, prefix?: any, notify?: any, ...rest: any[]): any {
    var valid: any = false;
    var tokenData: any = this.decodeToken(token);
    var issuedAt: any = tokenData.iat;
    var expTime: any = tokenData.exp;
    if (issuedAt && expTime) {
        var ttl: any = expTime - issuedAt;
        if (ttl > 0) {
            var clientExpiration: any = new Date().valueOf() + ttl*1000;
            store.set(prefix, token);
            store.set(prefix + '_expiration', clientExpiration);
            valid = true;
        }
    }
    if (!valid && notify) {
        (this.rootScope as any).$broadcast('unauthenticated');
    }
  }

  clearTokenData(...rest: any[]): any {
    store.remove('jwt_token');
    store.remove('jwt_token_expiration');
    store.remove('refresh_token');
    store.remove('refresh_token_expiration');
  }

  setUserFromJwtToken(jwtToken?: any, refreshToken?: any, notify?: any, doLogout?: any, ...rest: any[]): any {
    this.currentUser = null;
    this.currentUserDetails = null;
    this.lastPublicDashboardId = null;
    this.userTokenAccessEnabled = false;
    this.allowedDashboardIds = [];
    if (!jwtToken) {
        this.clearTokenData();
        if (notify) {
            (this.rootScope as any).$broadcast('unauthenticated', doLogout);
        }
    } else {
        this.updateAndValidateToken(jwtToken, 'jwt_token', true);
        this.updateAndValidateToken(refreshToken, 'refresh_token', true);
        if (notify) {
            this.loadUser(false).then(() => {
                (this.rootScope as any).$broadcast('authenticated');
            }, () => {
                (this.rootScope as any).$broadcast('unauthenticated');
            });
        } else {
            this.loadUser(false);
        }
    }
  }

  isAuthenticated(...rest: any[]): any {
    return store.get('jwt_token');
  }

  getJwtToken(...rest: any[]): any {
    return store.get('jwt_token');
  }

  logout(...rest: any[]): any {
    firstValueFrom(this.http.post('/api/auth/logout', null, {ignoreErrors: true} as any)).then(() => {
        this.clearJwtToken(true);
    }, () => {
        this.clearJwtToken(true);
    });
  }

  clearJwtToken(doLogout?: any, ...rest: any[]): any {
    this.setUserFromJwtToken(null, null, true, doLogout);
  }

  isJwtTokenValid(...rest: any[]): any {
    return this.isTokenValid('jwt_token');
  }

  isTokenValid(prefix?: any, ...rest: any[]): any {
    var clientExpiration: any = store.get(prefix + '_expiration');
    return clientExpiration && clientExpiration > new Date().valueOf();
  }

  validateJwtToken(doRefresh?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!this.isTokenValid('jwt_token')) {
        if (doRefresh) {
            this.refreshJwtToken().then(function success() {
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        } else {
            this.clearJwtToken(false);
            deferred.reject();
        }
    } else {
        deferred.resolve();
    }
    return deferred.promise;
  }

  resolveRefreshTokenQueue(data?: any, ...rest: any[]): any {
    for (var q: any=0; q < this.refreshTokenQueue.length;q++) {
        this.refreshTokenQueue[q].resolve(data);
    }
    this.refreshTokenQueue = [];
  }

  rejectRefreshTokenQueue(message?: any, ...rest: any[]): any {
    for (var q: any=0;q<this.refreshTokenQueue.length;q++) {
        this.refreshTokenQueue[q].reject(message);
    }
    this.refreshTokenQueue = [];
  }

  refreshTokenPending(...rest: any[]): any {
    return this.refreshTokenQueue.length > 0;
  }

  refreshJwtToken(...rest: any[]): any {
    var deferred: any = $q.defer();
    this.refreshTokenQueue.push(deferred);
    if (this.refreshTokenQueue.length === 1) {
        var refreshToken: any = store.get('refresh_token');
        var refreshTokenValid: any = this.isTokenValid('refresh_token');
        this.setUserFromJwtToken(null, null, false, false);
        if (!refreshTokenValid) {
            this.rejectRefreshTokenQueue(this.translate.instant('access.refresh-token-expired'));
        } else {
            var refreshTokenRequest: any = {
                refreshToken: refreshToken
            };
            firstValueFrom(this.http.post('/api/auth/token', refreshTokenRequest)).then((response?: any) => {
                var token: any = response.token;
                var refreshToken: any = response.refreshToken;
                this.setUserFromJwtToken(token, refreshToken, false);
                this.resolveRefreshTokenQueue(response);
            }, () => {
                this.clearJwtToken(false);
                this.rejectRefreshTokenQueue(this.translate.instant('access.refresh-token-failed'));
            });
        }
    }
    return deferred.promise;
  }

  getCurrentUser(...rest: any[]): any {
    return this.currentUser;
  }

  getAuthority(...rest: any[]): any {
    if (this.currentUser) {
        return this.currentUser.authority;
    } else {
        return '';
    }
    return undefined;
  }

  isPublic(...rest: any[]): any {
    if (this.currentUser) {
        return this.currentUser.isPublic;
    } else {
        return false;
    }
    return undefined;
  }

  getPublicId(...rest: any[]): any {
    if (this.isPublic()) {
        return this.currentUser.sub;
    } else {
        return null;
    }
    return undefined;
  }

  parsePublicId(...rest: any[]): any {
    var token: any = this.getJwtToken();
    if (token) {
        var tokenData: any = this.decodeToken(token);
        if (tokenData && tokenData.isPublic) {
            return tokenData.sub;
        }
    }
    return null;
  }

  isUserLoaded(...rest: any[]): any {
    return this.userLoaded;
  }

  loadUser(doTokenRefresh?: any, ...rest: any[]): any {

    var deferred: any = $q.defer();

    const fetchAllowedDashboardIds = (): any => {
        var pageLink: any = {limit: 100};
        var fetchDashboardsPromise: any;
        if (this.currentUser.authority === 'TENANT_ADMIN') {
            fetchDashboardsPromise = this.dashboardService.getTenantDashboards(pageLink);
        } else {
            fetchDashboardsPromise = this.dashboardService.getCustomerDashboards(this.currentUser.customerId, pageLink);
        }
        fetchDashboardsPromise.then(
            (result?: any) => {
                var dashboards: any = result.data;
                for (var d: any=0;d<dashboards.length;d++) {
                    this.allowedDashboardIds.push(dashboards[d].id.id);
                }
                deferred.resolve();
            },
            function fail() {
                deferred.reject();
            }
        );
    }

    const updateUserLang = (): any => {
        if (this.currentUserDetails.additionalInfo && this.currentUserDetails.additionalInfo.lang) {
            this.translate.use(this.currentUserDetails.additionalInfo.lang);
        }
    }

    const procceedJwtTokenValidate = (): any => {
        this.validateJwtToken(doTokenRefresh).then(() => {
            var jwtToken: any = store.get('jwt_token');
            this.currentUser = this.decodeToken(jwtToken);
            if (this.currentUser && this.currentUser.scopes && this.currentUser.scopes.length > 0) {
                this.currentUser.authority = this.currentUser.scopes[0];
            } else if (this.currentUser) {
                this.currentUser.authority = "ANONYMOUS";
            }
            var sysParamsPromise: any = this.loadSystemParams();
            if (this.currentUser.isPublic) {
                this.rootScope.forceFullscreen = true;
                sysParamsPromise.then(
                    () => { fetchAllowedDashboardIds(); },
                    () => { deferred.reject(); }
                );
            } else if (this.currentUser.userId) {
                this.getUser(this.currentUser.userId, true).then(
                    (user?: any) => {
                        sysParamsPromise.then(
                            () => {
                                this.currentUserDetails = user;
                                updateUserLang();
                                this.rootScope.forceFullscreen = false;
                                if (this.userForceFullscreen()) {
                                    this.rootScope.forceFullscreen = true;
                                }
                                if (this.rootScope.forceFullscreen && (this.currentUser.authority === 'TENANT_ADMIN' ||
                                    this.currentUser.authority === 'CUSTOMER_USER')) {
                                    fetchAllowedDashboardIds();
                                } else {
                                    deferred.resolve();
                                }
                            },
                            () => {
                                deferred.reject();
                                this.logout();
                            }
                        );
                    },
                    () => {
                        deferred.reject();
                        this.logout();
                    }
                )
            } else {
                deferred.reject();
            }
        }, function fail() {
            deferred.reject();
        });
    }

    if (!this.currentUser) {
        var locationSearch: any = (this.router as any).search();
        if (locationSearch.publicId) {
            this.loginService.publicLogin(locationSearch.publicId).then((response?: any) => {
                var token: any = response.data.token;
                var refreshToken: any = response.data.refreshToken;
                this.updateAndValidateToken(token, 'jwt_token', false);
                this.updateAndValidateToken(refreshToken, 'refresh_token', false);
                procceedJwtTokenValidate();
            }, () => {
                (this.router as any).search('publicId', null);
                deferred.reject();
            });
        } else if (locationSearch.accessToken) {
            var token: any = locationSearch.accessToken;
            var refreshToken: any = locationSearch.refreshToken;
            (this.router as any).search('accessToken', null);
            if (refreshToken) {
                (this.router as any).search('refreshToken', null);
            }
            try {
                this.updateAndValidateToken(token, 'jwt_token', false);
                if (refreshToken) {
                    this.updateAndValidateToken(refreshToken, 'refresh_token', false);
                } else {
                    store.remove('refresh_token');
                    store.remove('refresh_token_expiration');
                }
            } catch (e: any) {
                deferred.reject();
            }
            procceedJwtTokenValidate();
        } else if (locationSearch.username && locationSearch.password) {
            var user: any = {};
            user.name = locationSearch.username;
            user.password = locationSearch.password;
            (this.router as any).search('username', null);
            (this.router as any).search('password', null);

            this.loginService.login(user).then((response?: any) => {
                var token: any = response.data.token;
                var refreshToken: any = response.data.refreshToken;
                try {
                    this.updateAndValidateToken(token, 'jwt_token', false);
                    this.updateAndValidateToken(refreshToken, 'refresh_token', false);
                } catch (e: any) {
                    deferred.reject();
                }
                procceedJwtTokenValidate();
            }, function fail() {
                deferred.reject();
            });
        } else if (locationSearch.loginError) {
            this.showLoginErrorDialog(locationSearch.loginError);
            (this.router as any).search('loginError', null);
            deferred.reject();
        } else {
            procceedJwtTokenValidate();
        }
    } else {
        deferred.resolve();
    }
    return deferred.promise;
  }

  showLoginErrorDialog(loginError?: any, ...rest: any[]): any {
    (this.translate as any)(['login.error',
      'action.close']).then((translations?: any) => {
      var alert: any = (this.dialog as any).alert()
        .title(translations['login.error'])
        .htmlContent(loginError)
        .ok(translations['action.close']);
      (this.dialog as any).show(alert);
    });
  }

  loadIsUserTokenAccessEnabled(...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.currentUser.authority === 'SYS_ADMIN' || this.currentUser.authority === 'TENANT_ADMIN') {
        var url: any = '/api/user/tokenAccessEnabled';
        firstValueFrom(this.http.get(url)).then((response?: any) => {
            this.userTokenAccessEnabled = response;
            deferred.resolve(response);
        }, () => {
            this.userTokenAccessEnabled = false;
            deferred.reject();
        });
    } else {
        this.userTokenAccessEnabled = false;
        deferred.resolve(false);
    }
    return deferred.promise;
  }

  loadSystemParams(...rest: any[]): any {
    var promises: any = [];
    promises.push(this.loadIsUserTokenAccessEnabled());
    promises.push(this.timeService.loadMaxDatapointsLimit());
    return Promise.all(promises);
  }

  notifyUserLoaded(...rest: any[]): any {
    if (!this.userLoaded) {
        this.userLoaded = true;
        (this.rootScope as any).$broadcast('userLoaded');
    }
  }

  updateAuthorizationHeader(headers?: any, ...rest: any[]): any {
    var jwtToken: any = store.get('jwt_token');
    if (jwtToken) {
        headers['X-Authorization'] = 'Bearer ' + jwtToken;
    }
    return jwtToken;
  }

  setAuthorizationRequestHeader(request?: any, ...rest: any[]): any {
    var jwtToken: any = store.get('jwt_token');
    if (jwtToken) {
        request.setRequestHeader('X-Authorization', 'Bearer ' + jwtToken);
    }
    return jwtToken;
  }

  getTenantAdmins(tenantId?: any, pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/' + tenantId + '/users?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    firstValueFrom(this.http.get(url, null)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getCustomerUsers(customerId?: any, pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/users?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    firstValueFrom(this.http.get(url, null)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  saveUser(user?: any, sendActivationMail?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/user';
    if ((sendActivationMail !== undefined)) {
        url += '?sendActivationMail=' + sendActivationMail;
    }
    firstValueFrom(this.http.post(url, user)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  setUserCredentialsEnabled(userId?: any, userCredentialsEnabled?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/user/' + userId + '/userCredentialsEnabled';
    if ((userCredentialsEnabled !== undefined)) {
        url += '?userCredentialsEnabled=' + userCredentialsEnabled;
    }
    firstValueFrom(this.http.post(url, null)).then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getUser(userId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/user/' + userId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    firstValueFrom(this.http.get(url, config)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteUser(userId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/user/' + userId;
    firstValueFrom(this.http.delete(url)).then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  sendActivationEmail(email?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/user/sendActivationMail?email=' + email;
    firstValueFrom(this.http.post(url, null)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getActivationLink(userId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = `/api/user/${userId}/activationLink`;
    firstValueFrom(this.http.get(url)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  forceDefaultPlace(to?: any, params?: any, ...rest: any[]): any {
    if (this.currentUser && this.isAuthenticated()) {
        if (this.currentUser.authority === 'TENANT_ADMIN' || this.currentUser.authority === 'CUSTOMER_USER') {
            if ((this.userHasDefaultDashboard() && this.rootScope.forceFullscreen) || this.isPublic()) {
                if (to.name === 'home.profile') {
                    if (this.userHasProfile()) {
                        return false;
                    } else {
                        return true;
                    }
                } else if ((to.name === 'home.dashboards.dashboard' || to.name === 'dashboard')
                    && this.allowedDashboardIds.indexOf(params.dashboardId) > -1) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
    return false;
  }

  setRedirectParams(params?: any, ...rest: any[]): any {
    this.redirectParams = params;
  }

  gotoDefaultPlace(params?: any, ...rest: any[]): any {
    if (this.currentUser && this.isAuthenticated()) {
        var place: any = this.redirectParams ? this.redirectParams.toName : 'home.links';
        params = this.redirectParams ? this.redirectParams.params : params;
        this.redirectParams = null;
        if (this.currentUser.authority === 'TENANT_ADMIN' || this.currentUser.authority === 'CUSTOMER_USER') {
            if (this.userHasDefaultDashboard()) {
                place = this.rootScope.forceFullscreen ? 'dashboard' : 'home.dashboards.dashboard';
                params = {dashboardId: this.currentUserDetails.additionalInfo.defaultDashboardId};
            } else if (this.isPublic()) {
                place = 'dashboard';
                params = {dashboardId: this.lastPublicDashboardId};
            }
        } else if (this.currentUser.authority === 'SYS_ADMIN') {
            this.adminService.checkUpdates().then(
                (updateMessage?: any) => {
                    if (updateMessage && updateMessage.updateAvailable) {
                        this.toast.showInfo(updateMessage.message, 0, null, 'bottom right');
                    }
                }
            );
        }
        (this.router as any).go(place, params, {reload: true});
    } else {
        this.router.navigate(['/login'], { queryParams: params });
    }
  }

  userHasDefaultDashboard(...rest: any[]): any {
    return this.currentUserDetails &&
           this.currentUserDetails.additionalInfo &&
           this.currentUserDetails.additionalInfo.defaultDashboardId;
  }

  userForceFullscreen(...rest: any[]): any {
    return (this.currentUser && this.currentUser.isPublic) ||
           (this.currentUserDetails.additionalInfo &&
            this.currentUserDetails.additionalInfo.defaultDashboardFullscreen &&
            this.currentUserDetails.additionalInfo.defaultDashboardFullscreen === true);
  }

  userHasProfile(...rest: any[]): any {
    return this.currentUser && !this.currentUser.isPublic;
  }

  updateLastPublicDashboardId(dashboardId?: any, ...rest: any[]): any {
    if (this.isPublic()) {
        this.lastPublicDashboardId = dashboardId;
    }
  }

  isUserTokenAccessEnabled(...rest: any[]): any {
    return this.userTokenAccessEnabled;
  }

  loginAsUser(userId?: any, ...rest: any[]): any {
    var url: any = '/api/user/' + userId + '/token';
    firstValueFrom(this.http.get(url)).then((response?: any) => {
        var token: any = response.token;
        var refreshToken: any = response.refreshToken;
        this.setUserFromJwtToken(token, refreshToken, true);
    }, function fail() {
    });
  }
}
