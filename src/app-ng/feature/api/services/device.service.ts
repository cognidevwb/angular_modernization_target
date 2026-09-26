import { inject, Injectable } from '@angular/core';
import { AttributeService } from './attribute.service';
import { CustomerService } from './customer.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $window: any;

/**
 * Ported from the AngularJS factory `deviceService` (module `thingsboard.api.device`) in src/app/api/device.service.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  private readonly attributeService = inject(AttributeService);
  private readonly customerService = inject(CustomerService);
  private readonly userService = inject(UserService);

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  getTenantDevices(pageLink?: any, applyCustomersInfo?: any, config?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/devices?limit=' + pageLink.limit;
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
    this.http.get(url, config).toPromise().then((response?: any) => {
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

  getCustomerDevices(customerId?: any, pageLink?: any, applyCustomersInfo?: any, config?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/devices?limit=' + pageLink.limit;
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
    this.http.get(url, config).toPromise().then((response?: any) => {
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

  getDevice(deviceId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/device/' + deviceId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, {ignoreErrors: ignoreErrors});
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(response?: any) {
        deferred.reject(response.data);
    });
    return deferred.promise;
  }

  getDevices(deviceIds?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var ids: any = '';
    for (var i: any = 0; i < deviceIds.length; i++) {
        if (i > 0) {
            ids += ',';
        }
        ids += deviceIds[i];
    }
    var url: any = '/api/devices?deviceIds=' + ids;
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        var devices: any = response.data;
        devices.sort(function (device1?: any, device2?: any) {
            var id1: any = device1.id.id;
            var id2: any = device2.id.id;
            var index1: any = deviceIds.indexOf(id1);
            var index2: any = deviceIds.indexOf(id2);
            return index1 - index2;
        });
        deferred.resolve(devices);
    }, function fail(response?: any) {
        deferred.reject(response.data);
    });
    return deferred.promise;
  }

  saveDevice(device?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var url: any = '/api/device';
    this.http.post(url, device, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteDevice(deviceId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/device/' + deviceId;
    this.http.delete(url).toPromise().then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getDeviceCredentials(deviceId?: any, sync?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var url: any = '/api/device/' + deviceId + '/credentials';
    if (sync) {
        var request: any = new window.XMLHttpRequest();
        request.open('GET', url, false);
        request.setRequestHeader("Accept", "application/json, text/plain, */*");
        this.userService.setAuthorizationRequestHeader(request);
        request.send(null);
        if (request.status === 200) {
            deferred.resolve(JSON.parse(request.responseText));
        } else {
            deferred.reject();
        }
    } else {
        this.http.get(url, config).toPromise().then(function success(response?: any) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
    }
    return deferred.promise;
  }

  saveDeviceCredentials(deviceCredentials?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var url: any = '/api/device/credentials';
    this.http.post(url, deviceCredentials, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  assignDeviceToCustomer(customerId?: any, deviceId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/device/' + deviceId;
    this.http.post(url, null).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  unassignDeviceFromCustomer(deviceId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/device/' + deviceId;
    this.http.delete(url).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  makeDevicePublic(deviceId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/public/device/' + deviceId;
    this.http.post(url, null).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getDeviceAttributes(deviceId?: any, attributeScope?: any, query?: any, successCallback?: any, config?: any, ...rest: any[]): any {
    return this.attributeService.getEntityAttributes(types.entityType.device, deviceId, attributeScope, query, successCallback, config);
  }

  subscribeForDeviceAttributes(deviceId?: any, attributeScope?: any, ...rest: any[]): any {
    return this.attributeService.subscribeForEntityAttributes(types.entityType.device, deviceId, attributeScope);
  }

  unsubscribeForDeviceAttributes(subscriptionId?: any, ...rest: any[]): any {
    this.attributeService.unsubscribeForEntityAttributes(subscriptionId);
  }

  saveDeviceAttributes(deviceId?: any, attributeScope?: any, attributes?: any, ...rest: any[]): any {
    return this.attributeService.saveEntityAttributes(types.entityType.device, deviceId, attributeScope, attributes);
  }

  deleteDeviceAttributes(deviceId?: any, attributeScope?: any, attributes?: any, ...rest: any[]): any {
    return this.attributeService.deleteEntityAttributes(types.entityType.device, deviceId, attributeScope, attributes);
  }

  sendOneWayRpcCommand(deviceId?: any, requestBody?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/plugins/rpc/oneway/' + deviceId;
    this.http.post(url, requestBody).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(rejection?: any) {
        deferred.reject(rejection);
    });
    return deferred.promise;
  }

  sendTwoWayRpcCommand(deviceId?: any, requestBody?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/plugins/rpc/twoway/' + deviceId;
    this.http.post(url, requestBody).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(rejection?: any) {
        deferred.reject(rejection);
    });
    return deferred.promise;
  }

  findByQuery(query?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/devices';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, {ignoreErrors: ignoreErrors});
    this.http.post(url, query, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getDeviceTypes(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/device/types';
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByName(deviceName?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/devices?deviceName=' + deviceName;
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  claimDevice(deviceName?: any, deviceSecret?: any, config?: any, ...rest: any[]): any {
    deviceSecret = deviceSecret || {};
    config = config || {};
    const deferred: any = $q.defer();
    const url: any = '/api/customer/device/' + deviceName + '/claim';
    this.http.post(url, deviceSecret, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(rejection?: any) {
        deferred.reject(rejection);
    });
    return deferred.promise;
  }

  unclaimDevice(deviceName?: any, ...rest: any[]): any {
    const deferred: any = $q.defer();
    const url: any = '/api/customer/device/' + deviceName + '/claim';
    this.http.delete(url).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(rejection?: any) {
        deferred.reject(rejection);
    });
    return deferred.promise;
  }
}
