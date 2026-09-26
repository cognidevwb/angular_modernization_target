import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS factory `auditLogService` (module `thingsboard.api.auditLog`) in src/app/api/audit-log.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getAuditLogsByEntityId(entityType?: any, entityId?: any, pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = `/api/audit/logs/entity/${entityType}/${entityId}?limit=${pageLink.limit}`;

    if ((pageLink.startTime !== undefined) && pageLink.startTime != null) {
        url += '&startTime=' + pageLink.startTime;
    }
    if ((pageLink.endTime !== undefined) && pageLink.endTime != null) {
        url += '&endTime=' + pageLink.endTime;
    }
    if ((pageLink.idOffset !== undefined) && pageLink.idOffset != null) {
        url += '&offset=' + pageLink.idOffset;
    }
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response.data);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  getAuditLogsByUserId(userId?: any, pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = `/api/audit/logs/user/${userId}?limit=${pageLink.limit}`;

    if ((pageLink.startTime !== undefined) && pageLink.startTime != null) {
        url += '&startTime=' + pageLink.startTime;
    }
    if ((pageLink.endTime !== undefined) && pageLink.endTime != null) {
        url += '&endTime=' + pageLink.endTime;
    }
    if ((pageLink.idOffset !== undefined) && pageLink.idOffset != null) {
        url += '&offset=' + pageLink.idOffset;
    }
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response.data);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  getAuditLogsByCustomerId(customerId?: any, pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = `/api/audit/logs/customer/${customerId}?limit=${pageLink.limit}`;

    if ((pageLink.startTime !== undefined) && pageLink.startTime != null) {
        url += '&startTime=' + pageLink.startTime;
    }
    if ((pageLink.endTime !== undefined) && pageLink.endTime != null) {
        url += '&endTime=' + pageLink.endTime;
    }
    if ((pageLink.idOffset !== undefined) && pageLink.idOffset != null) {
        url += '&offset=' + pageLink.idOffset;
    }
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response.data);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  getAuditLogs(pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = `/api/audit/logs?limit=${pageLink.limit}`;

    if ((pageLink.startTime !== undefined) && pageLink.startTime != null) {
        url += '&startTime=' + pageLink.startTime;
    }
    if ((pageLink.endTime !== undefined) && pageLink.endTime != null) {
        url += '&endTime=' + pageLink.endTime;
    }
    if ((pageLink.idOffset !== undefined) && pageLink.idOffset != null) {
        url += '&offset=' + pageLink.idOffset;
    }
this.http.get(url, null).toPromise().then(function success(response?: any) {
    deferred.resolve(response.data);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }
}
