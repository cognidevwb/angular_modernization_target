import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `customerService` (module `thingsboard.api.customer`) in src/app/api/customer.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getCustomers(pageLink?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customers?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getCustomer(customerId?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId;
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response);
    });
    return deferred.promise;
  }

  getShortCustomerInfo(customerId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/shortInfo';
    this.http.get(url, null).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response);
    });
    return deferred.promise;
  }

  applyAssignedCustomersInfo(items?: any, ...rest: any[]): any {
    const loadNextCustomerInfo = (i?: any): any => {
        var item: any = items[i];
        item.assignedCustomer = {};
        if (item.customerId && item.customerId.id != types.id.nullUid) {
            item.assignedCustomer.id = item.customerId.id;
            var assignedCustomer: any = assignedCustomersMap[item.customerId.id];
            if (assignedCustomer){
                item.assignedCustomer = assignedCustomer;
                loadNextCustomerInfoOrComplete(i);
            } else {
                this.getShortCustomerInfo(item.customerId.id).then(
                    function success(info?: any) {
                        assignedCustomer = {
                            id: item.customerId.id,
                            title: info.title,
                            isPublic: info.isPublic
                        };
                        assignedCustomersMap[assignedCustomer.id] = assignedCustomer;
                        item.assignedCustomer = assignedCustomer;
                        loadNextCustomerInfoOrComplete(i);
                    },
                    function fail() {
                        loadNextCustomerInfoOrComplete(i);
                    }
                );
            }
        } else {
            loadNextCustomerInfoOrComplete(i);
        }
    }
    var deferred: any = $q.defer();
    var assignedCustomersMap: any = {};
    function loadNextCustomerInfoOrComplete(i?: any): any {
        i++;
        if (i < items.length) {
            loadNextCustomerInfo(i);
        } else {
            deferred.resolve(items);
        }
    }


    if (items.length > 0) {
        loadNextCustomerInfo(0);
    } else {
        deferred.resolve(items);
    }
    return deferred.promise;
  }

  applyAssignedCustomerInfo(items?: any, customerId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.getShortCustomerInfo(customerId).then(
        function success(info?: any) {
            var assignedCustomer: any = {
                id: customerId,
                title: info.title,
                isPublic: info.isPublic
            }
            items.forEach(function(item?: any) {
                item.assignedCustomer = assignedCustomer;
            });
            deferred.resolve(items);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  saveCustomer(customer?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer';
    this.http.post(url, customer).toPromise().then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response);
    });
    return deferred.promise;
  }

  deleteCustomer(customerId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId;
    this.http.delete(url).toPromise().then(function success() {
        deferred.resolve();
    }, function fail(response?: any) {
        deferred.reject(response);
    });
    return deferred.promise;
  }
}
