import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootState } from '../../../root-state';
import { bindMethods } from '../../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `loginService` (module `thingsboard.api.login`) in src/app/api/login.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly rootScope = inject(RootState);

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  hasUser(...rest: any[]): any {
    return true;
  }

  login(user?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var loginRequest: any = {
        username: user.name,
        password: user.password
    };
this.http.post('/api/auth/login', loginRequest).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail(response?: any) {
    deferred.reject(response);
});
    return deferred.promise;
  }

  publicLogin(publicId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var pubilcLoginRequest: any = {
        publicId: publicId
    };
this.http.post('/api/auth/login/public', pubilcLoginRequest).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail(response?: any) {
    deferred.reject(response);
});
    return deferred.promise;
  }

  sendResetPasswordLink(email?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/noauth/resetPasswordByEmail';
this.http.post(url, {email: email}).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  resetPassword(resetToken?: any, password?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/noauth/resetPassword';
this.http.post(url, {resetToken: resetToken, password: password}).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  activate(activateToken?: any, password?: any, sendActivationMail?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/noauth/activate';
    if(sendActivationMail === true || sendActivationMail === false) {
        url += '?sendActivationMail=' + sendActivationMail;
    }
this.http.post(url, {activateToken: activateToken, password: password}).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  changePassword(currentPassword?: any, newPassword?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/auth/changePassword';
this.http.post(url, {currentPassword: currentPassword, newPassword: newPassword}).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  loadOAuth2Clients(...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/noauth/oauth2Clients';
this.http.post(url, {}).toPromise().then((response?: any) => {
    this.rootScope.oauth2Clients = response.data;
    deferred.resolve();
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }
}
