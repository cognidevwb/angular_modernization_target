import { inject, Injectable } from '@angular/core';
import { CustomerService } from './customer.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS factory `assetService` (module `thingsboard.api.asset`) in src/app/api/asset.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class AssetService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly customerService = inject(CustomerService);
  private readonly userService = inject(UserService);

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  getAsset(assetId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/asset/' + assetId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getAssets(assetIds?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var ids: any = '';
    for (var i: any=0;i<assetIds.length;i++) {
        if (i>0) {
            ids += ',';
        }
        ids += assetIds[i];
    }
    var url: any = '/api/assets?assetIds=' + ids;
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        var assets: any = response.data;
        assets.sort(function (asset1?: any, asset2?: any) {
            var id1: any =  asset1.id.id;
            var id2: any =  asset2.id.id;
            var index1: any = assetIds.indexOf(id1);
            var index2: any = assetIds.indexOf(id2);
            return index1 - index2;
        });
        deferred.resolve(assets);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  saveAsset(asset?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/asset';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.post(url, asset, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteAsset(assetId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/asset/' + assetId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.delete(url, config).toPromise().then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  assignAssetToCustomer(customerId?: any, assetId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/asset/' + assetId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.post(url, null, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  unassignAssetFromCustomer(assetId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/asset/' + assetId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.delete(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  makeAssetPublic(assetId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/public/asset/' + assetId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.post(url, null, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getTenantAssets(pageLink?: any, applyCustomersInfo?: any, config?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/assets?limit=' + pageLink.limit;
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

  getCustomerAssets(customerId?: any, pageLink?: any, applyCustomersInfo?: any, config?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/assets?limit=' + pageLink.limit;
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

  findByQuery(query?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/assets';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    this.http.post(url, query, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  fetchAssetsByNameFilter(assetNameFilter?: any, limit?: any, applyCustomersInfo?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var user: any = this.userService.getCurrentUser();
    var promise: any;
    var pageLink: any = {limit: limit, textSearch: assetNameFilter};
    if (user.authority === 'CUSTOMER_USER') {
        var customerId: any = user.customerId;
        promise = this.getCustomerAssets(customerId, pageLink, applyCustomersInfo, config);
    } else {
        promise = this.getTenantAssets(pageLink, applyCustomersInfo, config);
    }
    promise.then(
        function success(result?: any) {
            if (result.data && result.data.length > 0) {
                deferred.resolve(result.data);
            } else {
                deferred.resolve(null);
            }
        },
        function fail() {
            deferred.resolve(null);
        }
    );
    return deferred.promise;
  }

  getAssetTypes(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/asset/types';
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  findByName(assetName?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/assets?assetName=' + assetName;
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }
}
