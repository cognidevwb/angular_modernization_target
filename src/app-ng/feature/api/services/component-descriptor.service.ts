import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS factory `componentDescriptorService` (module `thingsboard.api.componentDescriptor`) in src/app/api/component-descriptor.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class ComponentDescriptorService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable

  private componentsByType: any = {};
  private componentsByClazz: any = {};
  private actionsByPlugin: any = {};

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getComponentDescriptorsByType(componentType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.componentsByType[componentType]) {
        deferred.resolve(this.componentsByType[componentType]);
    } else {
        var url: any = '/api/components/' + componentType;
        this.http.get(url, null).toPromise().then((response?: any) => {
            this.componentsByType[componentType] = response.data;
            for (var i: any = 0; i < this.componentsByType[componentType].length; i++) {
                var component: any = this.componentsByType[componentType][i];
                this.componentsByClazz[component.clazz] = component;
            }
            deferred.resolve(this.componentsByType[componentType]);
        }, function fail() {
            deferred.reject();
        });

    }
    return deferred.promise;
  }

  getComponentDescriptorsByTypes(componentTypes?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var result: any = [];
    for (var i: any=componentTypes.length-1;i>=0;i--) {
        var componentType: any = componentTypes[i];
        if (this.componentsByType[componentType]) {
            result = result.concat(this.componentsByType[componentType]);
            componentTypes.splice(i, 1);
        }
    }
    if (!componentTypes.length) {
        deferred.resolve(result);
    } else {
        var url: any = '/api/components?componentTypes=' + componentTypes.join(',');
        this.http.get(url, null).toPromise().then((response?: any) => {
            var components: any = response.data;
            for (var i: any = 0; i < components.length; i++) {
                var component: any = components[i];
                var componentsList: any = this.componentsByType[component.type];
                if (!componentsList) {
                    componentsList = [];
                    this.componentsByType[component.type] = componentsList;
                }
                componentsList.push(component);
                this.componentsByClazz[component.clazz] = component;
            }
            result = result.concat(components);
            deferred.resolve(components);
        }, function fail() {
            deferred.reject();
        });
    }
    return deferred.promise;
  }

  getComponentDescriptorByClazz(componentDescriptorClazz?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.componentsByClazz[componentDescriptorClazz]) {
        deferred.resolve(this.componentsByClazz[componentDescriptorClazz]);
    } else {
        var url: any = '/api/component/' + componentDescriptorClazz;
        this.http.get(url, null).toPromise().then((response?: any) => {
            this.componentsByClazz[componentDescriptorClazz] = response.data;
            deferred.resolve(this.componentsByClazz[componentDescriptorClazz]);
        }, function fail() {
            deferred.reject();
        });
    }
    return deferred.promise;
  }

  getPluginActionsByPluginClazz(pluginClazz?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.actionsByPlugin[pluginClazz]) {
        deferred.resolve(this.actionsByPlugin[pluginClazz]);
    } else {
        var url: any = '/api/components/actions/' + pluginClazz;
        this.http.get(url, null).toPromise().then((response?: any) => {
            this.actionsByPlugin[pluginClazz] = response.data;
            deferred.resolve(this.actionsByPlugin[pluginClazz]);
        }, function fail() {
            deferred.reject();
        });
    }
    return deferred.promise;
  }
}
