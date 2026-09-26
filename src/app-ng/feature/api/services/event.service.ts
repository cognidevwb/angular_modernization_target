import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `eventService` (module `thingsboard.api.event`) in src/app/api/event.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getEvents(entityType?: any, entityId?: any, eventType?: any, tenantId?: any, pageLink?: any, ...rest: any[]): any {
    var url: any = '/api/events/'+entityType+'/'+entityId+'/'+eventType+'?tenantId=' + tenantId + '&limit=' + pageLink.limit;

    if ((pageLink.startTime !== undefined) && pageLink.startTime != null) {
        url += '&startTime=' + pageLink.startTime;
    }
    if ((pageLink.endTime !== undefined) && pageLink.endTime != null) {
        url += '&endTime=' + pageLink.endTime;
    }
    if ((pageLink.idOffset !== undefined) && pageLink.idOffset != null) {
        url += '&offset=' + pageLink.idOffset;
    }
    return new Promise((resolve, reject) => {
      firstValueFrom(this.http.get(url)).then(function success(response?: any) {
          resolve(response);
      }, function fail() {
          reject();
      });
    });
  }
}
