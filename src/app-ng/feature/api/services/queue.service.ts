import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `queueService` (module `thingsboard.api.queue`) in src/app/api/queue.service.js:17.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class QueueService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getTenantQueuesByServiceType(serviceType?: any, config?: any, ...rest: any[]): any {
    let deferred: any = $q.defer();
    let url: any = '/api/tenant/queues?serviceType=' + serviceType;

    this.http.get(url, config).toPromise().then(function success(data?: any) {
        deferred.resolve(data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }
}
