import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TelemetryWebsocketService } from './telemetry-websocket.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $filter: any;
declare let $q: any;
declare let scope: any;

/**
 * Ported from the AngularJS factory `attributeService` (module `thingsboard.api.attribute`) in src/app/api/attribute.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class AttributeService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly telemetryWebsocketService = inject(TelemetryWebsocketService);

  private entityAttributesSubscriptionMap: any = {};

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  getEntityKeys(entityType?: any, entityId?: any, query?: any, type?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/keys/';
    if (type === types.dataKeyType.timeseries) {
        url += 'timeseries';
    } else if (type === types.dataKeyType.attribute) {
        url += 'attributes';
    }
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        var result: any = [];
        if (response.data) {
            if (query) {
                var dataKeys: any = response.data;
                var lowercaseQuery: any = query.toLowerCase();
                for (var i: any=0; i<dataKeys.length;i++) {
                    if (dataKeys[i].toLowerCase().indexOf(lowercaseQuery) === 0) {
                        result.push(dataKeys[i]);
                    }
                }
            } else {
                result = response.data;
            }
        }
        deferred.resolve(result);
    }, function fail(response?: any) {
        deferred.reject(response.data);
    });
    return deferred.promise;
  }

  getEntityTimeseriesValues(entityType?: any, entityId?: any, keys?: any, startTs?: any, endTs?: any, limit?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/values/timeseries';
    url += '?keys=' + keys;
    url += '&startTs=' + startTs;
    url += '&endTs=' + endTs;
    if ((limit !== undefined)) {
        url += '&limit=' + limit;
    }
    this.http.get(url, null).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(response?: any) {
        deferred.reject(response.data);
    });
    return deferred.promise;
  }

  getEntityAttributesValues(entityType?: any, entityId?: any, attributeScope?: any, keys?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/values/attributes/' + attributeScope;
    if (keys && keys.length) {
        url += '?keys=' + keys;
    }
    this.http.get(url, config).toPromise().then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  processAttributes(attributes?: any, query?: any, deferred?: any, successCallback?: any, update?: any, apply?: any, ...rest: any[]): any {
    attributes = $filter('orderBy')(attributes, query.order);
    if (query.search != null) {
        attributes = $filter('filter')(attributes, {key: query.search});
    }
    var responseData: any = {
        count: attributes.length
    }
    var startIndex: any = query.limit * (query.page - 1);
    responseData.data = attributes.slice(startIndex, startIndex + query.limit);
    successCallback(responseData, update, apply);
    if (deferred) {
        deferred.resolve();
    }
  }

  getEntityAttributes(entityType?: any, entityId?: any, attributeScope?: any, query?: any, successCallback?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var subscriptionId: any = entityType + entityId + attributeScope;
    var eas: any = this.entityAttributesSubscriptionMap[subscriptionId];
    if (eas) {
        if (eas.attributes) {
            this.processAttributes(eas.attributes, query, deferred, successCallback);
            eas.subscriptionCallback = (attributes?: any) => {
                this.processAttributes(attributes, query, null, successCallback, true, true);
            }
        } else {
            eas.subscriptionCallback = (attributes?: any) => {
                this.processAttributes(attributes, query, deferred, successCallback, false, true);
                eas.subscriptionCallback = (attributes?: any) => {
                    this.processAttributes(attributes, query, null, successCallback, true, true);
                }
            }
        }
    } else {
        var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/values/attributes/' + attributeScope;
    this.http.get(url, config).toPromise().then((response?: any) => {
        this.processAttributes(response.data, query, deferred, successCallback);
    }, function fail() {
        deferred.reject();
    });
    }
    return deferred;
  }

  onSubscriptionData(data?: any, subscriptionId?: any, ...rest: any[]): any {
    var entityAttributesSubscription: any = this.entityAttributesSubscriptionMap[subscriptionId];
    if (entityAttributesSubscription) {
        if (!entityAttributesSubscription.attributes) {
            entityAttributesSubscription.attributes = [];
            entityAttributesSubscription.keys = {};
        }
        var attributes: any = entityAttributesSubscription.attributes;
        var keys: any = entityAttributesSubscription.keys;
        for (var key in data) {
            var index: any = keys[key];
            var attribute: any;
            if (index > -1) {
                attribute = attributes[index];
            } else {
                attribute = {
                    key: key
                };
                index = attributes.push(attribute)-1;
                keys[key] = index;
            }
            var attrData: any = data[key][0];
            attribute.lastUpdateTs = attrData[0];
            attribute.value = attrData[1];
        }
        if (entityAttributesSubscription.subscriptionCallback) {
            entityAttributesSubscription.subscriptionCallback(attributes);
        }
    }
  }

  subscribeForEntityAttributes(entityType?: any, entityId?: any, attributeScope?: any, ...rest: any[]): any {
    var subscriptionId: any = entityType + entityId + attributeScope;
    var entityAttributesSubscription: any = this.entityAttributesSubscriptionMap[subscriptionId];
    if (!entityAttributesSubscription) {
        var subscriptionCommand: any = {
            entityType: entityType,
            entityId: entityId,
            scope: attributeScope
        };

        var type: any = attributeScope === types.latestTelemetry.value ?
            types.dataKeyType.timeseries : types.dataKeyType.attribute;

        var subscriber: any = {
            subscriptionCommands: [subscriptionCommand],
            type: type,
            onData: (data?: any, ...rest: any[]) => {
                if (data.data) {
                    this.onSubscriptionData(data.data, subscriptionId);
                }
            }
        };
        entityAttributesSubscription = {
            subscriber: subscriber,
            attributes: null
        };
        this.entityAttributesSubscriptionMap[subscriptionId] = entityAttributesSubscription;
        this.telemetryWebsocketService.subscribe(subscriber);
    }
    return subscriptionId;
  }

  unsubscribeForEntityAttributes(subscriptionId?: any, ...rest: any[]): any {
    var entityAttributesSubscription: any = this.entityAttributesSubscriptionMap[subscriptionId];
    if (entityAttributesSubscription) {
        this.telemetryWebsocketService.unsubscribe(entityAttributesSubscription.subscriber);
        delete this.entityAttributesSubscriptionMap[subscriptionId];
    }
  }

  saveEntityAttributes(entityType?: any, entityId?: any, attributeScope?: any, attributes?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var attributesData: any = {};
    var deleteAttributes: any = [];
    for (var a: any=0; a<attributes.length;a++) {
        if ((attributes[a].value !== undefined) && attributes[a].value !== null) {
            attributesData[attributes[a].key] = attributes[a].value;
        } else {
            deleteAttributes.push(attributes[a]);
        }
    }
    var deleteEntityAttributesPromise: any;
    if (deleteAttributes.length) {
        deleteEntityAttributesPromise = this.deleteEntityAttributes(entityType, entityId, attributeScope, deleteAttributes, config);
    }
    if (Object.keys(attributesData).length) {
        var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/' + attributeScope;
    this.http.post(url, attributesData, config).toPromise().then((response?: any) => {
        if (deleteEntityAttributesPromise) {
            deleteEntityAttributesPromise.then(
                function success() {
                    deferred.resolve(response.data);
                },
                function fail() {
                    deferred.reject();
                }
            )
        } else {
            deferred.resolve(response.data);
        }
    }, function fail() {
        deferred.reject();
    });
    } else if (deleteEntityAttributesPromise) {
        deleteEntityAttributesPromise.then(
            function success() {
                deferred.resolve();
            },
            function fail() {
                deferred.reject();
            }
        )
    } else {
        deferred.resolve();
    }
    return deferred.promise;
  }

  saveEntityTimeseries(entityType?: any, entityId?: any, timeseriesScope?: any, timeseries?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var timeseriesData: any = {};
    var deleteTimeseries: any = [];
    for (var a: any=0; a<timeseries.length;a++) {
        if ((timeseries[a].value !== undefined) && timeseries[a].value !== null) {
            timeseriesData[timeseries[a].key] = timeseries[a].value;
        } else {
            deleteTimeseries.push(timeseries[a]);
        }
    }
    var deleteEntityTimeseriesPromise: any;
    if (deleteTimeseries.length) {
        deleteEntityTimeseriesPromise = this.deleteEntityTimeseries(entityType, entityId, deleteTimeseries, config, true);
    }
    if (Object.keys(timeseriesData).length) {
        var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/timeseries/' + timeseriesScope;
    this.http.post(url, timeseriesData, config).toPromise().then((response?: any) => {
        if (deleteEntityTimeseriesPromise) {
            deleteEntityTimeseriesPromise.then(
                function success() {
                    deferred.resolve(response.data);
                },
                function fail() {
                    deferred.reject();
                }
            )
        } else {
            deferred.resolve(response.data);
        }
    }, function fail() {
        deferred.reject();
    });
    } else if (deleteEntityTimeseriesPromise) {
        deleteEntityTimeseriesPromise.then(
            function success() {
                deferred.resolve();
            },
            function fail() {
                deferred.reject();
            }
        )
    } else {
        deferred.resolve();
    }
    return deferred.promise;
  }

  deleteEntityAttributes(entityType?: any, entityId?: any, attributeScope?: any, attributes?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    var deferred: any = $q.defer();
    var keys: any = '';
    for (var i: any = 0; i < attributes.length; i++) {
        if (i > 0) {
            keys += ',';
        }
        keys += attributes[i].key;
    }
    var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/' + attributeScope + '?keys=' + keys;
    this.http.delete(url, config).toPromise().then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteEntityTimeseries(entityType?: any, entityId?: any, timeseries?: any, config?: any, deleteAllDataForKeys?: any, ...rest: any[]): any {
    config = config || {};
    deleteAllDataForKeys = deleteAllDataForKeys || false;
    var deferred: any = $q.defer();
    var keys: any = '';
    for (var i: any = 0; i < timeseries.length; i++) {
        if (i > 0) {
            keys += ',';
        }
        keys += timeseries[i].key;
    }
    var url: any = '/api/plugins/telemetry/' + entityType + '/' + entityId + '/timeseries/delete' +
        '?keys=' + keys +
        '&deleteAllDataForKeys=' + deleteAllDataForKeys;
    this.http.delete(url, config).toPromise().then(function success() {
        deferred.resolve();
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }
}
