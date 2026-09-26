import { inject, Injectable } from '@angular/core';
import { ComponentDescriptorService } from './component-descriptor.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $filter: any;
declare let $ocLazyLoad: any;

/**
 * Ported from the AngularJS factory `ruleChainService` (module `thingsboard.api.ruleChain`) in src/app/api/rule-chain.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class RuleChainService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  private readonly http = inject(HttpClient);
  // TODO(port): '$ocLazyLoad' — an AngularJS built-in with no Angular counterpart
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly translate = inject(TranslateService);
  private readonly componentDescriptorService = inject(ComponentDescriptorService);

  private ruleNodeComponents: any = null;

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getRuleChains(pageLink?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChains?limit=' + pageLink.limit;
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

  getRuleChain(ruleChainId?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain/' + ruleChainId;
this.http.get(url, config).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  saveRuleChain(ruleChain?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain';
this.http.post(url, ruleChain).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  setRootRuleChain(ruleChainId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain/' + ruleChainId + '/root';
this.http.post(url, {}).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  deleteRuleChain(ruleChainId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain/' + ruleChainId;
this.http.delete(url).toPromise().then(function success() {
    deferred.resolve();
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  getRuleChainMetaData(ruleChainId?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain/' + ruleChainId + '/metadata';
this.http.get(url, config).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  saveRuleChainMetaData(ruleChainMetaData?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain/metadata';
this.http.post(url, ruleChainMetaData).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  getRuleNodeSupportedLinks(component?: any, ...rest: any[]): any {
    var relationTypes: any = component.configurationDescriptor.nodeDefinition.relationTypes;
    var linkLabels: any = {};
    for (var i: any=0;i<relationTypes.length;i++) {
        var label: any = relationTypes[i];
        linkLabels[label] = {
            name: label,
            value: label
        };
    }
    return linkLabels;
  }

  ruleNodeAllowCustomLinks(component?: any, ...rest: any[]): any {
    return component.configurationDescriptor.nodeDefinition.customRelations;
  }

  getRuleNodeComponents(...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.ruleNodeComponents) {
        deferred.resolve(this.ruleNodeComponents);
    } else {
        this.loadRuleNodeComponents().then(
            (components?: any) => {
                this.resolveRuleNodeComponentsUiResources(components).then(
                    (components?: any) => {
                        this.ruleNodeComponents = components;
                        this.ruleNodeComponents.push(
                            types.ruleChainNodeComponent
                        );
                        this.ruleNodeComponents.sort(
                            (comp1?: any, comp2?: any) => {
                                var result: any = comp1.type.localeCompare(comp2.type);
                                if (result == 0) {
                                    result = comp1.name.localeCompare(comp2.name);
                                }
                                return result;
                            }
                        );
                        deferred.resolve(this.ruleNodeComponents);
                    },
                    () => {
                        deferred.reject();
                    }
                );
            },
            () => {
                deferred.reject();
            }
        );
    }
    return deferred.promise;
  }

  resolveRuleNodeComponentsUiResources(components?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var tasks: any = [];
    for (var i: any=0;i<components.length;i++) {
        var component: any = components[i];
        tasks.push(this.resolveRuleNodeComponentUiResources(component));
    }
    Promise.all(tasks).then(
        (components?: any) => {
            deferred.resolve(components);
        },
        () => {
            deferred.resolve(components);
        }
    );
    return deferred.promise;
  }

  resolveRuleNodeComponentUiResources(component?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var uiResources: any = component.configurationDescriptor.nodeDefinition.uiResources;
    if (uiResources && uiResources.length) {
        var tasks: any = [];
        for (var i: any=0;i<uiResources.length;i++) {
            var uiResource: any = uiResources[i];
            tasks.push(import(/* webpackIgnore: true */ uiResource));
        }
        Promise.all(tasks).then(
            () => {
                deferred.resolve(component);
            },
            () => {
                component.configurationDescriptor.nodeDefinition.uiResourceLoadError = this.translate.instant('rulenode.ui-resources-load-error');
                deferred.resolve(component);
            }
        )
    } else {
        deferred.resolve(component);
    }
    return deferred.promise;
  }

  getRuleNodeComponentByClazz(clazz?: any, ...rest: any[]): any {
    var res: any = (this.ruleNodeComponents || []).filter((c: any) => c.clazz === clazz);
    if (res && res.length) {
        return res[0];
    }
    var unknownComponent: any = structuredClone(types.unknownNodeComponent);
    unknownComponent.clazz = clazz;
    unknownComponent.configurationDescriptor.nodeDefinition.details = "Unknown Rule Node class: " + clazz;
    return unknownComponent;
  }

  resolveTargetRuleChains(ruleChainConnections?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (ruleChainConnections && ruleChainConnections.length) {
        var tasks: any = [];
        for (var i: any = 0; i < ruleChainConnections.length; i++) {
            tasks.push(this.resolveRuleChain(ruleChainConnections[i].targetRuleChainId.id));
        }
        Promise.all(tasks).then(
            (ruleChains?: any) => {
                var ruleChainsMap: any = {};
                for (var i: any = 0; i < ruleChains.length; i++) {
                    ruleChainsMap[ruleChains[i].id.id] = ruleChains[i];
                }
                deferred.resolve(ruleChainsMap);
            },
            () => {
                deferred.reject();
            }
        );
    } else {
        deferred.resolve({});
    }
    return deferred.promise;
  }

  resolveRuleChain(ruleChainId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.getRuleChain(ruleChainId, {ignoreErrors: true}).then(
        (ruleChain?: any) => {
            deferred.resolve(ruleChain);
        },
        () => {
            deferred.resolve({
                id: {id: ruleChainId, entityType: types.entityType.rulechain}
            });
        }
    );
    return deferred.promise;
  }

  loadRuleNodeComponents(...rest: any[]): any {
    return this.componentDescriptorService.getComponentDescriptorsByTypes(types.ruleNodeTypeComponentTypes);
  }

  testScript(inputParams?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleChain/testScript';
this.http.post(url, inputParams).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }

  getLatestRuleNodeDebugInput(ruleNodeId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/ruleNode/' + ruleNodeId + '/debugIn';
this.http.get(url).toPromise().then(function success(response?: any) {
    deferred.resolve(response);
}, function fail() {
    deferred.reject();
});
    return deferred.promise;
  }
}
