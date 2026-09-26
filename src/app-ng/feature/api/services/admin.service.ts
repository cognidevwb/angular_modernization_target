import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS factory `adminService` (module `thingsboard.api.admin`) in src/app/api/admin.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getAdminSettings(key?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/admin/settings/' + key;
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  saveAdminSettings(settings?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/admin/settings';
this.http.post(url, settings).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail(response?: any) {
    deferred.reject(response?.error);
});
    return deferred.promise;
  }

  getSecuritySettings(...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/admin/securitySettings';
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  saveSecuritySettings(securitySettings?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/admin/securitySettings';
this.http.post(url, securitySettings).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail(response?: any) {
    deferred.reject(response?.error);
});
    return deferred.promise;
  }

  sendTestMail(settings?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/admin/settings/testMail';
this.http.post(url, settings).toPromise().then(function success() {
    deferred.resolve();
}, function fail(response?: any) {
    deferred.reject(response?.error);
});
    return deferred.promise;
  }

  checkUpdates(...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/admin/updates';
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }
}
