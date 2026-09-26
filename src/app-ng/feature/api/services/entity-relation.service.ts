import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS factory `entityRelationService` (module `thingsboard.api.entityRelation`) in src/app/api/entity-relation.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class EntityRelationService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  saveRelation(relation?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relation';
    (this.http.post(url, relation) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteRelation(fromId?: any, fromType?: any, relationType?: any, toId?: any, toType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relation?fromId=' + fromId;
    url += '&fromType=' + fromType;
    url += '&relationType=' + relationType;
    url += '&toId=' + toId;
    url += '&toType=' + toType;
    (this.http.delete(url) as any).toPromise().then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteRelations(entityId?: any, entityType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations?entityId=' + entityId;
    url += '&entityType=' + entityType;
    (this.http.delete(url) as any).toPromise().then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getRelation(fromId?: any, fromType?: any, relationType?: any, toId?: any, toType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relation?fromId=' + fromId;
    url += '&fromType=' + fromType;
    url += '&relationType=' + relationType;
    url += '&toId=' + toId;
    url += '&toType=' + toType;
    (this.http.get(url) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByFrom(fromId?: any, fromType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations?fromId=' + fromId;
    url += '&fromType=' + fromType;
    (this.http.get(url, null) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findInfoByFrom(fromId?: any, fromType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations/info?fromId=' + fromId;
    url += '&fromType=' + fromType;
    (this.http.get(url, null) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByFromAndType(fromId?: any, fromType?: any, relationType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations?fromId=' + fromId;
    url += '&fromType=' + fromType;
    url += '&relationType=' + relationType;
    (this.http.get(url, null) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByTo(toId?: any, toType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations?toId=' + toId;
    url += '&toType=' + toType;
    (this.http.get(url, null) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findInfoByTo(toId?: any, toType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations/info?toId=' + toId;
    url += '&toType=' + toType;
    (this.http.get(url, null) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByToAndType(toId?: any, toType?: any, relationType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations?toId=' + toId;
    url += '&toType=' + toType;
    url += '&relationType=' + relationType;
    (this.http.get(url, null) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByQuery(query?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations';
    (this.http.post(url, query, config) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(e?: any) {
        deferred.reject(e);
    });
    return deferred.promise;
  }

  findInfoByQuery(query?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/relations/info';
    (this.http.post(url, query, config) as any).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }
}
