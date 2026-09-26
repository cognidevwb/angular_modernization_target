import { inject, Injectable } from '@angular/core';
import { AttributeService } from './attribute.service';
import { CustomerService } from './customer.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `entityViewService` (module `thingsboard.api.entityView`) in src/app/api/entity-view.service.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class EntityViewService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly attributeService = inject(AttributeService);
  private readonly customerService = inject(CustomerService);
  private readonly userService = inject(UserService);

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  getTenantEntityViews(pageLink?: any, applyCustomersInfo?: any, config?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/entityViews?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    if ((type !== undefined) && type.length) {
        url += '&type=' + type;
    }
    this.http.get(url, config).then((response?: any) => {
        if (applyCustomersInfo) {
            this.customerService.applyAssignedCustomersInfo(response.data.data).then(
                function success(data?: any) {
                    response.data.data = data;
                    deferred.resolve(response.data);
                },
                function fail() {
                    deferred.reject();
                }
            );
        } else {
            deferred.resolve(response.data);
        }
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getCustomerEntityViews(customerId?: any, pageLink?: any, applyCustomersInfo?: any, config?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/entityViews?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    if ((type !== undefined) && type.length) {
        url += '&type=' + type;
    }
    this.http.get(url, config).then((response?: any) => {
        if (applyCustomersInfo) {
            this.customerService.applyAssignedCustomerInfo(response.data.data, customerId).then(
                function success(data?: any) {
                    response.data.data = data;
                    deferred.resolve(response.data);
                },
                function fail() {
                    deferred.reject();
                }
            );
        } else {
            deferred.resolve(response.data);
        }
    }, function fail() {
        deferred.reject();
    });

    return deferred.promise;
  }

  getEntityView(entityViewId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/entityView/' + entityViewId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.get(url, config).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(response?: any) {
        deferred.reject(response.data);
    });
    return deferred.promise;
  }

  saveEntityView(entityView?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/entityView';

    this.http.post(url, entityView).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteEntityView(entityViewId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/entityView/' + entityViewId;
    this.http.delete(url).then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  assignEntityViewToCustomer(customerId?: any, entityViewId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/entityView/' + entityViewId;
    this.http.post(url, null).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  unassignEntityViewFromCustomer(entityViewId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/entityView/' + entityViewId;
    this.http.delete(url).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getEntityViewAttributes(entityViewId?: any, attributeScope?: any, query?: any, successCallback?: any, config?: any, ...rest: any[]): any {
    return this.attributeService.getEntityAttributes(types.entityType.entityView, entityViewId, attributeScope, query, successCallback, config);
  }

  subscribeForEntityViewAttributes(entityViewId?: any, attributeScope?: any, ...rest: any[]): any {
    return this.attributeService.subscribeForEntityAttributes(types.entityType.entityView, entityViewId, attributeScope);
  }

  unsubscribeForEntityViewAttributes(subscriptionId?: any, ...rest: any[]): any {
    this.attributeService.unsubscribeForEntityAttributes(subscriptionId);
  }

  findByQuery(query?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/entityViews';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.post(url, query, config).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getEntityViewTypes(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/entityView/types';
    this.http.get(url, config).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  makeEntityViewPublic(entityViewId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/public/entityView/' + entityViewId;
    this.http.post(url, null).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }
}
