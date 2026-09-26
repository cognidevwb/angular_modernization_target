import { httpOptions } from '../../../core/http-options';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS factory `tenantService` (module `thingsboard.api.tenant`) in src/app/api/tenant.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getTenants(pageLink?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenants?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    this.http.get(url, httpOptions(config)).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getTenant(tenantId?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/' + tenantId;
    this.http.get(url, httpOptions(config)).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response?.error);
    });
    return deferred.promise;
  }

  saveTenant(tenant?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant';
    this.http.post(url, tenant).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response?.error);
    });
    return deferred.promise;
  }

  deleteTenant(tenantId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/' + tenantId;
    this.http.delete(url).toPromise().then(function success() {
        deferred.resolve();
    }, function fail(response?: any) {
        deferred.reject(response?.error);
    });
    return deferred.promise;
  }
}
