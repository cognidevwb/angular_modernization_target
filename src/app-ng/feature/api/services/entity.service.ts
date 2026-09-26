import { inject, Injectable } from '@angular/core';
import { AssetService } from './asset.service';
import { AttributeService } from './attribute.service';
import { CustomerService } from './customer.service';
import { DashboardService } from './dashboard.service';
import { DeviceService } from './device.service';
import { EntityRelationService } from './entity-relation.service';
import { EntityViewService } from './entity-view.service';
import { HttpClient } from '@angular/common/http';
import { RuleChainService } from './rule-chain.service';
import { TenantService } from './tenant.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $filter: any;

/**
 * Ported from the AngularJS factory `entityService` (module `thingsboard.api.entity`) in src/app/api/entity.service.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 5 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class EntityService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly translate = inject(TranslateService);
  private readonly assetService = inject(AssetService);
  private readonly attributeService = inject(AttributeService);
  private readonly customerService = inject(CustomerService);
  private readonly dashboardService = inject(DashboardService);
  private readonly deviceService = inject(DeviceService);
  private readonly entityRelationService = inject(EntityRelationService);
  private readonly entityViewService = inject(EntityViewService);
  private readonly ruleChainService = inject(RuleChainService);
  private readonly tenantService = inject(TenantService);
  private readonly userService = inject(UserService);
  private readonly utils = inject(UtilsService);

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `fail` — a named function expression that calls itself; as an arrow it has no name: name it as a method
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  getEntityPromise(entityType?: any, entityId?: any, config?: any, ...rest: any[]): any {
    var promise: any;
    switch (entityType) {
        case types.entityType.device:
            promise = this.deviceService.getDevice(entityId, true, config);
            break;
        case types.entityType.asset:
            promise = this.assetService.getAsset(entityId, true, config);
            break;
        case types.entityType.entityView:
            promise = this.entityViewService.getEntityView(entityId, true, config);
            break;
        case types.entityType.tenant:
            promise = this.tenantService.getTenant(entityId, config);
            break;
        case types.entityType.customer:
            promise = this.customerService.getCustomer(entityId, config);
            break;
        case types.entityType.dashboard:
            promise = this.dashboardService.getDashboardInfo(entityId, config);
            break;
        case types.entityType.user:
            promise = this.userService.getUser(entityId, true, config);
            break;
        case types.entityType.rulechain:
            promise = this.ruleChainService.getRuleChain(entityId, config);
            break;
        case types.entityType.alarm:
            console.error('Get Alarm Entity is not implemented!');
            break;
    }
    return promise;
  }

  getEntity(entityType?: any, entityId?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var promise: any = this.getEntityPromise(entityType, entityId, config);
    if (promise) {
        promise.then(
            function success(result?: any) {
                deferred.resolve(result);
            },
            function fail() {
                deferred.reject();
            }
        );
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  getEntitiesByIdsPromise(fetchEntityFunction?: any, entityIds?: any, ...rest: any[]): any {
    var tasks: any = [];
    var deferred: any = $q.defer();
    for (var i: any=0;i<entityIds.length;i++) {
        tasks.push(fetchEntityFunction(entityIds[i]));
    }
    Promise.all(tasks).then(
        function success(entities?: any) {
            if (entities) {
                entities.sort(function (entity1?: any, entity2?: any) {
                    var id1: any = entity1.id.id;
                    var id2: any = entity2.id.id;
                    var index1: any = entityIds.indexOf(id1);
                    var index2: any = entityIds.indexOf(id2);
                    return index1 - index2;
                });
                deferred.resolve(entities);
            } else {
                deferred.resolve([]);
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getEntitiesPromise(entityType?: any, entityIds?: any, config?: any, ...rest: any[]): any {
    var promise: any;
    switch (entityType) {
        case types.entityType.device:
            promise = this.deviceService.getDevices(entityIds, config);
            break;
        case types.entityType.asset:
            promise = this.assetService.getAssets(entityIds, config);
            break;
        case types.entityType.entityView:
            promise = this.getEntitiesByIdsPromise(
                (id?: any) => this.entityViewService.getEntityView(id, config), entityIds);
            break;
        case types.entityType.tenant:
            promise = this.getEntitiesByIdsPromise(
                (id?: any) => this.tenantService.getTenant(id, config), entityIds);
            break;
        case types.entityType.customer:
            promise = this.getEntitiesByIdsPromise(
                (id?: any) => this.customerService.getCustomer(id, config), entityIds);
            break;
        case types.entityType.dashboard:
            promise = this.getEntitiesByIdsPromise(
                (id?: any) => this.dashboardService.getDashboardInfo(id, config), entityIds);
            break;
        case types.entityType.user:
            promise = this.getEntitiesByIdsPromise(
                (id?: any) => this.userService.getUser(id, true, config), entityIds);
            break;
        case types.entityType.alarm:
            console.error('Get Alarm Entity is not implemented!');
            break;
    }
    return promise;
  }

  getEntities(entityType?: any, entityIds?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var promise: any = this.getEntitiesPromise(entityType, entityIds, config);
    if (promise) {
        promise.then(
            function success(result?: any) {
                deferred.resolve(result);
            },
            function fail() {
                deferred.reject();
            }
        );
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  getSingleTenantByPageLinkPromise(pageLink?: any, config?: any, ...rest: any[]): any {
    var user: any = this.userService.getCurrentUser();
    var tenantId: any = user.tenantId;
    var deferred: any = $q.defer();
    this.tenantService.getTenant(tenantId, config).then(
        function success(tenant?: any) {
            var tenantName: any = tenant.name;
            var result: any = {
                data: [],
                nextPageLink: pageLink,
                hasNext: false
            };
            if (tenantName.toLowerCase().startsWith(pageLink.textSearch)) {
                result.data.push(tenant);
            }
            deferred.resolve(result);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getSingleCustomerByPageLinkPromise(pageLink?: any, config?: any, ...rest: any[]): any {
    var user: any = this.userService.getCurrentUser();
    var customerId: any = user.customerId;
    var deferred: any = $q.defer();
    this.customerService.getCustomer(customerId, config).then(
        function success(customer?: any) {
            var customerName: any = customer.name;
            var result: any = {
                data: [],
                nextPageLink: pageLink,
                hasNext: false
            };
            if (customerName.toLowerCase().startsWith(pageLink.textSearch)) {
                result.data.push(customer);
            }
            deferred.resolve(result);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getEntitiesByPageLinkPromise(entityType?: any, pageLink?: any, config?: any, subType?: any, ...rest: any[]): any {
    var promise: any;
    var user: any = this.userService.getCurrentUser();
    var customerId: any = user.customerId;
    switch (entityType) {
        case types.entityType.device:
            if (user.authority === 'CUSTOMER_USER') {
                promise = this.deviceService.getCustomerDevices(customerId, pageLink, false, config, subType);
            } else {
                promise = this.deviceService.getTenantDevices(pageLink, false, config, subType);
            }
            break;
        case types.entityType.asset:
            if (user.authority === 'CUSTOMER_USER') {
                promise = this.assetService.getCustomerAssets(customerId, pageLink, false, config, subType);
            } else {
                promise = this.assetService.getTenantAssets(pageLink, false, config, subType);
            }
            break;
        case types.entityType.entityView:
            if (user.authority === 'CUSTOMER_USER') {
                promise = this.entityViewService.getCustomerEntityViews(customerId, pageLink, false, config, subType);
            } else {
                promise = this.entityViewService.getTenantEntityViews(pageLink, false, config, subType);
            }
            break;
        case types.entityType.tenant:
            if (user.authority === 'TENANT_ADMIN') {
                promise = this.getSingleTenantByPageLinkPromise(pageLink, config);
            } else {
                promise = this.tenantService.getTenants(pageLink, config);
            }
            break;
        case types.entityType.customer:
            if (user.authority === 'CUSTOMER_USER') {
                promise = this.getSingleCustomerByPageLinkPromise(pageLink, config);
            } else {
                promise = this.customerService.getCustomers(pageLink, config);
            }
            break;
        case types.entityType.rulechain:
            promise = this.ruleChainService.getRuleChains(pageLink, config);
            break;
        case types.entityType.dashboard:
            if (user.authority === 'CUSTOMER_USER') {
                promise = this.dashboardService.getCustomerDashboards(customerId, pageLink, config);
            } else {
                promise = this.dashboardService.getTenantDashboards(pageLink, config);
            }
            break;
        case types.entityType.user:
            console.error('Get User Entities is not implemented!');
            break;
        case types.entityType.alarm:
            console.error('Get Alarm Entities is not implemented!');
            break;
    }
    return promise;
  }

  getEntitiesByPageLink(entityType?: any, pageLink?: any, config?: any, subType?: any, data?: any, deferred?: any, ...rest: any[]): any {
    var promise: any = this.getEntitiesByPageLinkPromise(entityType, pageLink, config, subType);
    if (promise) {
        promise.then(
            (result?: any) => {
                data = data.concat(result.data);
                if (result.hasNext) {
                    pageLink = result.nextPageLink;
                    this.getEntitiesByPageLink(entityType, pageLink, config, subType, data, deferred);
                } else {
                    if (data && data.length > 0) {
                        deferred.resolve(data);
                    } else {
                        deferred.resolve(null);
                    }
                }
            },
            function fail() {
                deferred.resolve(null);
            }
        );
    } else {
        deferred.resolve(null);
    }
  }

  getEntitiesByNameFilter(entityType?: any, entityNameFilter?: any, limit?: any, config?: any, subType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var pageLink: any = {limit: limit, textSearch: entityNameFilter};
    if (limit == -1) { // all
        var data: any = [];
        pageLink.limit = 100;
        this.getEntitiesByPageLink(entityType, pageLink, config, subType, data, deferred);
    } else {
        var promise: any = this.getEntitiesByPageLinkPromise(entityType, pageLink, config, subType);
        if (promise) {
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
        } else {
            deferred.resolve(null);
        }
    }
    return deferred.promise;
  }

  entityToEntityInfo(entity?: any, ...rest: any[]): any {
    return {
        origEntity: entity,
        name: entity.name,
        label: entity.label?entity.label:"",
        entityType: entity.id.entityType,
        id: entity.id.id,
        entityDescription: entity.additionalInfo?entity.additionalInfo.description:""
    };
  }

  entityRelationInfoToEntityInfoFunc(entityRelationInfo?: any, direction?: any, ...rest: any[]): any {
    return () => {
      var deferred: any = $q.defer();
      var entityId: any = direction == types.entitySearchDirection.from ? entityRelationInfo.to : entityRelationInfo.from;
      this.getEntity(entityId.entityType, entityId.id, {ignoreLoading: true}).then(
        (entity?: any) => {
          deferred.resolve(this.entityToEntityInfo(entity));
        },
        function fail() {
          deferred.reject();
        }
      );
      return deferred.promise;
    }
  }

  entitiesToEntitiesInfo(entities?: any, ...rest: any[]): any {
    var entitiesInfo: any = [];
    if (entities) {
        for (var d: any = 0; d < entities.length; d++) {
            entitiesInfo.push(this.entityToEntityInfo(entities[d]));
        }
    }
    return entitiesInfo;
  }

  entityRelationInfosToEntitiesInfo(entityRelations?: any, direction?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (entityRelations && entityRelations.length) {
      var entityInfoTasks: any = [];
      for (var d: any = 0; d < entityRelations.length; d++) {
        entityInfoTasks.push(this.entityRelationInfoToEntityInfoFunc(entityRelations[d], direction));
      }
      this.sendPackedRequests(entityInfoTasks).then(
        function success(entityInfos?: any) {
          deferred.resolve(entityInfos);
        }, function fail () {
          deferred.reject();
        }
      );
    } else {
      deferred.resolve([]);
    }
    return deferred.promise;
  }

  sendPackedRequests(taskFunctions?: any, ...rest: any[]): any {
    var taskFunctionPacks: any = [];
    for (var e: any = 0; e < taskFunctions.length; e+=100) {
      taskFunctionPacks.push(taskFunctions.slice(e,e + 100));
    }
    var deferred: any = $q.defer();
    var resolvePack: any = [];
    this.doSendPackedRequests(taskFunctionPacks, 0, resolvePack, deferred);
    return deferred.promise;
  }

  doSendPackedRequests(functionPack?: any, index?: any, resolvePack?: any, deferred?: any, ...rest: any[]): any {
    var tasks: any = [];
    var currentFunctionPack: any = functionPack[index];
    for (var i: any=0;i<currentFunctionPack.length;i++) {
      tasks.push(currentFunctionPack[i]());
    }
    Promise.all(tasks).then(
      (response?: any) => {
        resolvePack = resolvePack.concat(response);
        index++;
        if (functionPack[index]) {
          this.doSendPackedRequests(functionPack, index, resolvePack, deferred);
        } else {
          deferred.resolve(resolvePack);
        }
      },
      function fail() {
        deferred.reject();
      }
    );
  }

  resolveAlias(entityAlias?: any, stateParams?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var filter: any = entityAlias.filter;
    this.resolveAliasFilter(filter, stateParams, -1, false).then(
        function (result?: any) {
            var aliasInfo: any = {
                alias: entityAlias.alias,
                stateEntity: result.stateEntity,
                entityParamName: result.entityParamName,
                resolveMultiple: filter.resolveMultiple
            };
            aliasInfo.resolvedEntities = result.entities;
            aliasInfo.currentEntity = null;
            if (aliasInfo.resolvedEntities.length) {
                aliasInfo.currentEntity = aliasInfo.resolvedEntities[0];
            }
            deferred.resolve(aliasInfo);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  resolveAliasEntityId(entityType?: any, id?: any, ...rest: any[]): any {
    var entityId: any = {
        entityType: entityType,
        id: id
    };
    if (entityType == types.aliasEntityType.current_customer) {
        var user: any = this.userService.getCurrentUser();
        entityId.entityType = types.entityType.customer;
        if (user.authority === 'CUSTOMER_USER') {
            entityId.id = user.customerId;
        }
    } else if (entityType === types.aliasEntityType.current_tenant){
        let user: any = this.userService.getCurrentUser();
        entityId.entityType = types.entityType.tenant;
        entityId.id = user.tenantId;
    }
    return entityId;
  }

  getStateEntityInfo(filter?: any, stateParams?: any, ...rest: any[]): any {
    var entityId: any = null;
    if (stateParams) {
        if (filter.stateEntityParamName && filter.stateEntityParamName.length) {
            if (stateParams[filter.stateEntityParamName]) {
                entityId = stateParams[filter.stateEntityParamName].entityId;
            }
        } else {
            entityId = stateParams.entityId;
        }
    }
    if (!entityId) {
        entityId = filter.defaultStateEntity;
    }
    if (entityId) {
        entityId = this.resolveAliasEntityId(entityId.entityType, entityId.id);
    }
    return {
        entityId: entityId
    };
  }

  resolveAliasFilter(filter?: any, stateParams?: any, maxItems?: any, failOnEmpty?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var result: any = {
        entities: [],
        stateEntity: false
    };
    if (filter.stateEntityParamName && filter.stateEntityParamName.length) {
        result.entityParamName = filter.stateEntityParamName;
    }
    var stateEntityInfo: any = this.getStateEntityInfo(filter, stateParams);
    var stateEntityId: any = stateEntityInfo.entityId;
    switch (filter.type) {
        case types.aliasFilterType.singleEntity.value:
            var aliasEntityId: any = this.resolveAliasEntityId(filter.singleEntity.entityType, filter.singleEntity.id);
            this.getEntity(aliasEntityId.entityType, aliasEntityId.id, {ignoreLoading: true}).then(
                (entity?: any) => {
                    result.entities = this.entitiesToEntitiesInfo([entity]);
                    deferred.resolve(result);
                },
                function fail() {
                    deferred.reject();
                }
            );
            break;
        case types.aliasFilterType.entityList.value:
            this.getEntities(filter.entityType, filter.entityList, {ignoreLoading: true}).then(
                (entities?: any) => {
                    if (entities && entities.length || !failOnEmpty) {
                        result.entities = this.entitiesToEntitiesInfo(entities);
                        deferred.resolve(result);
                    } else {
                        deferred.reject();
                    }
                },
                function fail() {
                    deferred.reject();
                }
            );
            break;
        case types.aliasFilterType.entityName.value:
            this.getEntitiesByNameFilter(filter.entityType, filter.entityNameFilter, maxItems, {ignoreLoading: true}).then(
                (entities?: any) => {
                    if (entities && entities.length || !failOnEmpty) {
                        result.entities = this.entitiesToEntitiesInfo(entities);
                        deferred.resolve(result);
                    } else {
                        deferred.reject();
                    }
                },
                function fail() {
                    deferred.reject();
                }
            );
            break;
        case types.aliasFilterType.stateEntity.value:
            result.stateEntity = true;
            if (stateEntityId) {
                this.getEntity(stateEntityId.entityType, stateEntityId.id, {ignoreLoading: true}).then(
                    (entity?: any) => {
                        result.entities = this.entitiesToEntitiesInfo([entity]);
                        deferred.resolve(result);
                    },
                    function fail() {
                        deferred.resolve(result);
                    }
                );
            } else {
                deferred.resolve(result);
            }
            break;
        case types.aliasFilterType.assetType.value:
            this.getEntitiesByNameFilter(types.entityType.asset, filter.assetNameFilter, maxItems, {ignoreLoading: true}, filter.assetType).then(
                (entities?: any) => {
                    if (entities && entities.length || !failOnEmpty) {
                        result.entities = this.entitiesToEntitiesInfo(entities);
                        deferred.resolve(result);
                    } else {
                        deferred.reject();
                    }
                },
                function fail() {
                    deferred.reject();
                }
            );
            break;
        case types.aliasFilterType.deviceType.value:
            this.getEntitiesByNameFilter(types.entityType.device, filter.deviceNameFilter, maxItems, {ignoreLoading: true}, filter.deviceType).then(
                (entities?: any) => {
                    if (entities && entities.length || !failOnEmpty) {
                        result.entities = this.entitiesToEntitiesInfo(entities);
                        deferred.resolve(result);
                    } else {
                        deferred.reject();
                    }
                },
                function fail() {
                    deferred.reject();
                }
            );
            break;
        case types.aliasFilterType.entityViewType.value:
            this.getEntitiesByNameFilter(types.entityType.entityView, filter.entityViewNameFilter, maxItems, {ignoreLoading: true}, filter.entityViewType).then(
                (entities?: any) => {
                    if (entities && entities.length || !failOnEmpty) {
                        result.entities = this.entitiesToEntitiesInfo(entities);
                        deferred.resolve(result);
                    } else {
                        deferred.reject();
                    }
                },
                function fail() {
                    deferred.reject();
                }
            );
            break;
        case types.aliasFilterType.relationsQuery.value:
            result.stateEntity = filter.rootStateEntity;
            var rootEntityType: any;
            var rootEntityId: any;
            if (result.stateEntity && stateEntityId) {
                rootEntityType = stateEntityId.entityType;
                rootEntityId = stateEntityId.id;
            } else if (!result.stateEntity) {
                rootEntityType = filter.rootEntity.entityType;
                rootEntityId = filter.rootEntity.id;
            }
            if (rootEntityType && rootEntityId) {
                var relationQueryRootEntityId: any = this.resolveAliasEntityId(rootEntityType, rootEntityId);
                var searchQuery: any = {
                    parameters: {
                        rootId: relationQueryRootEntityId.id,
                        rootType: relationQueryRootEntityId.entityType,
                        direction: filter.direction,
                        fetchLastLevelOnly: filter.fetchLastLevelOnly
                    },
                    filters: filter.filters
                };
                searchQuery.parameters.maxLevel = filter.maxLevel && filter.maxLevel > 0 ? filter.maxLevel : -1;
                this.entityRelationService.findInfoByQuery(searchQuery, {ignoreLoading: true}).then(
                    (allRelations?: any) => {
                        if (allRelations && allRelations.length || !failOnEmpty) {
                            if ((maxItems !== undefined) && maxItems > 0 && allRelations) {
                                var limit: any = Math.min(allRelations.length, maxItems);
                                allRelations.length = limit;
                            }
                            this.entityRelationInfosToEntitiesInfo(allRelations, filter.direction).then(
                                function success(entities?: any) {
                                    result.entities = entities;
                                    deferred.resolve(result);
                                },
                                function fail() {
                                    deferred.reject();
                                }
                            );
                        } else {
                            deferred.reject();
                        }
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            } else {
                deferred.resolve(result);
            }
            break;
        case types.aliasFilterType.assetSearchQuery.value:
        case types.aliasFilterType.deviceSearchQuery.value:
        case types.aliasFilterType.entityViewSearchQuery.value:
            result.stateEntity = filter.rootStateEntity;
            if (result.stateEntity && stateEntityId) {
                rootEntityType = stateEntityId.entityType;
                rootEntityId = stateEntityId.id;
            } else if (!result.stateEntity) {
                rootEntityType = filter.rootEntity.entityType;
                rootEntityId = filter.rootEntity.id;
            }
            if (rootEntityType && rootEntityId) {
                var searchQueryRootEntityId: any = this.resolveAliasEntityId(rootEntityType, rootEntityId);
                searchQuery = {
                    parameters: {
                        rootId: searchQueryRootEntityId.id,
                        rootType: searchQueryRootEntityId.entityType,
                        direction: filter.direction,
                        fetchLastLevelOnly: filter.fetchLastLevelOnly
                    },
                    relationType: filter.relationType
                };
                searchQuery.parameters.maxLevel = filter.maxLevel && filter.maxLevel > 0 ? filter.maxLevel : -1;
                var findByQueryPromise: any;
                if (filter.type == types.aliasFilterType.assetSearchQuery.value) {
                    searchQuery.assetTypes = filter.assetTypes;
                    findByQueryPromise = this.assetService.findByQuery(searchQuery, false, {ignoreLoading: true});
                } else if (filter.type == types.aliasFilterType.deviceSearchQuery.value) {
                    searchQuery.deviceTypes = filter.deviceTypes;
                    findByQueryPromise = this.deviceService.findByQuery(searchQuery, false, {ignoreLoading: true});
                } else if (filter.type == types.aliasFilterType.entityViewSearchQuery.value) {
                    searchQuery.entityViewTypes = filter.entityViewTypes;
                    findByQueryPromise = this.entityViewService.findByQuery(searchQuery, false, {ignoreLoading: true});
                }
                findByQueryPromise.then(
                    (entities?: any) => {
                        if (entities && entities.length || !failOnEmpty) {
                            if ((maxItems !== undefined) && maxItems > 0 && entities) {
                                var limit: any = Math.min(entities.length, maxItems);
                                entities.length = limit;
                            }
                            result.entities = this.entitiesToEntitiesInfo(entities);
                            deferred.resolve(result);
                        } else {
                            deferred.reject();
                        }
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            } else {
                deferred.resolve(result);
            }
            break;
    }
    return deferred.promise;
  }

  filterAliasByEntityTypes(entityAlias?: any, entityTypes?: any, ...rest: any[]): any {
    var filter: any = entityAlias.filter;
    if (this.filterAliasFilterTypeByEntityTypes(filter.type, entityTypes)) {
        switch (filter.type) {
            case types.aliasFilterType.singleEntity.value:
                return entityTypes.indexOf(filter.singleEntity.entityType) > -1 ? true : false;
            case types.aliasFilterType.entityList.value:
                return entityTypes.indexOf(filter.entityType) > -1 ? true : false;
            case types.aliasFilterType.entityName.value:
                return entityTypes.indexOf(filter.entityType) > -1 ? true : false;
            case types.aliasFilterType.stateEntity.value:
                return true;
            case types.aliasFilterType.assetType.value:
                return entityTypes.indexOf(types.entityType.asset)  > -1 ? true : false;
            case types.aliasFilterType.deviceType.value:
                return entityTypes.indexOf(types.entityType.device)  > -1 ? true : false;
            case types.aliasFilterType.entityViewType.value:
                return entityTypes.indexOf(types.entityType.entityView)  > -1 ? true : false;
            case types.aliasFilterType.relationsQuery.value:
                if (filter.filters && filter.filters.length) {
                    var match: any = false;
                    for (var f: any=0;f<filter.filters.length;f++) {
                        var relationFilter: any = filter.filters[f];
                        if (relationFilter.entityTypes && relationFilter.entityTypes.length) {
                            for (var et: any=0;et<relationFilter.entityTypes.length;et++) {
                                if (entityTypes.indexOf(relationFilter.entityTypes[et]) > -1) {
                                    match = true;
                                    break;
                                }
                            }
                        } else {
                            match = true;
                            break;
                        }
                    }
                    return match;
                } else {
                    return true;
                }
            case types.aliasFilterType.assetSearchQuery.value:
                return entityTypes.indexOf(types.entityType.asset)  > -1 ? true : false;
            case types.aliasFilterType.deviceSearchQuery.value:
                return entityTypes.indexOf(types.entityType.device)  > -1 ? true : false;
            case types.aliasFilterType.entityViewSearchQuery.value:
                return entityTypes.indexOf(types.entityType.entityView)  > -1 ? true : false;
        }
    }
    return false;
  }

  filterAliasFilterTypeByEntityType(aliasFilterType?: any, entityType?: any, ...rest: any[]): any {
    switch (aliasFilterType) {
        case types.aliasFilterType.singleEntity.value:
            return true;
        case types.aliasFilterType.entityList.value:
            return true;
        case types.aliasFilterType.entityName.value:
            return true;
        case types.aliasFilterType.stateEntity.value:
            return true;
        case types.aliasFilterType.assetType.value:
            return entityType === types.entityType.asset;
        case types.aliasFilterType.deviceType.value:
            return entityType === types.entityType.device;
        case types.aliasFilterType.entityViewType.value:
            return entityType === types.entityType.entityView;
        case types.aliasFilterType.relationsQuery.value:
            return true;
        case types.aliasFilterType.assetSearchQuery.value:
            return entityType === types.entityType.asset;
        case types.aliasFilterType.deviceSearchQuery.value:
            return entityType === types.entityType.device;
        case types.aliasFilterType.entityViewSearchQuery.value:
            return entityType === types.entityType.entityView;
    }
    return false;
  }

  filterAliasFilterTypeByEntityTypes(aliasFilterType?: any, entityTypes?: any, ...rest: any[]): any {
    if (!entityTypes || !entityTypes.length) {
        return true;
    }
    var valid: any = false;
    entityTypes.forEach((entityType?: any) => {
        valid = valid || this.filterAliasFilterTypeByEntityType(aliasFilterType, entityType);
    });
    return valid;
  }

  getAliasFilterTypesByEntityTypes(entityTypes?: any, ...rest: any[]): any {
    var allAliasFilterTypes: any = types.aliasFilterType;
    if (!entityTypes || !entityTypes.length) {
        return allAliasFilterTypes;
    }
    var result: any = {};
    for (var type in allAliasFilterTypes) {
        var aliasFilterType: any = allAliasFilterTypes[type];
        if (this.filterAliasFilterTypeByEntityTypes(aliasFilterType.value, entityTypes)) {
            result[type] = aliasFilterType;
        }
    }
    return result;
  }

  prepareAllowedEntityTypesList(allowedEntityTypes?: any, useAliasEntityTypes?: any, ...rest: any[]): any {
    var authority: any = this.userService.getAuthority();
    var entityTypes: any = {};
    switch(authority) {
        case 'SYS_ADMIN':
            entityTypes.tenant = types.entityType.tenant;
            break;
        case 'TENANT_ADMIN':
            entityTypes.device = types.entityType.device;
            entityTypes.asset = types.entityType.asset;
            entityTypes.entityView = types.entityType.entityView;
            entityTypes.tenant = types.entityType.tenant;
            entityTypes.customer = types.entityType.customer;
            entityTypes.dashboard = types.entityType.dashboard;
            if (useAliasEntityTypes) {
                entityTypes.current_customer = types.aliasEntityType.current_customer;
                entityTypes.current_tenant = types.aliasEntityType.current_tenant;
            }
            break;
        case 'CUSTOMER_USER':
            entityTypes.device = types.entityType.device;
            entityTypes.asset = types.entityType.asset;
            entityTypes.entityView = types.entityType.entityView;
            entityTypes.customer = types.entityType.customer;
            entityTypes.dashboard = types.entityType.dashboard;
            if (useAliasEntityTypes) {
                entityTypes.current_customer = types.aliasEntityType.current_customer;
            }
            break;
    }

    if (allowedEntityTypes) {
        for (var entityType in entityTypes) {
            if (allowedEntityTypes.indexOf(entityTypes[entityType]) === -1) {
                delete entityTypes[entityType];
            }
        }
    }
    return entityTypes;
  }

  checkEntityAlias(entityAlias?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.resolveAliasFilter(entityAlias.filter, null, 1, true).then(
        function success(result?: any) {
            if (result.stateEntity) {
                deferred.resolve(true);
            } else {
                var entities: any = result.entities;
                if (entities && entities.length) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            }
        },
        function fail() {
            deferred.resolve(false);
        }
    );
    return deferred.promise;
  }

  getEntityFieldKeys(entityType?: any, searchText?: any, ...rest: any[]): any {
    let entityFieldKeys: any = [];
    let query: any = searchText ? searchText.toLowerCase() : "";
    switch(entityType) {
        case types.entityType.user:
            entityFieldKeys.push(types.entityField.name.keyName);
            entityFieldKeys.push(types.entityField.email.keyName);
            entityFieldKeys.push(types.entityField.firstName.keyName);
            entityFieldKeys.push(types.entityField.lastName.keyName);
            break;
        case types.entityType.tenant:
        case types.entityType.customer:
            entityFieldKeys.push(types.entityField.title.keyName);
            entityFieldKeys.push(types.entityField.email.keyName);
            entityFieldKeys.push(types.entityField.country.keyName);
            entityFieldKeys.push(types.entityField.state.keyName);
            entityFieldKeys.push(types.entityField.city.keyName);
            entityFieldKeys.push(types.entityField.address.keyName);
            entityFieldKeys.push(types.entityField.address2.keyName);
            entityFieldKeys.push(types.entityField.zip.keyName);
            entityFieldKeys.push(types.entityField.phone.keyName);
            break;
        case types.entityType.entityView:
            entityFieldKeys.push(types.entityField.name.keyName);
            entityFieldKeys.push(types.entityField.type.keyName);
            break;
        case types.entityType.device:
        case types.entityType.asset:
            entityFieldKeys.push(types.entityField.name.keyName);
            entityFieldKeys.push(types.entityField.type.keyName);
            entityFieldKeys.push(types.entityField.label.keyName);
            break;
        case types.entityType.dashboard:
            entityFieldKeys.push(types.entityField.title.keyName);
            break;
    }

    return query ? entityFieldKeys.filter((entityField?: any) => entityField.toLowerCase().indexOf(query) === 0) : entityFieldKeys;
  }

  getEntityKeys(entityType?: any, entityId?: any, query?: any, type?: any, config?: any, ...rest: any[]): any {
    if (type === types.dataKeyType.entityField) {
        return Promise.resolve(this.getEntityFieldKeys(entityType, query));
    }
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
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  createDatasourcesFromSubscriptionsInfo(subscriptionsInfo?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var datasources: any = [];
    this.processSubscriptionsInfo(0, subscriptionsInfo, datasources, deferred);
    return deferred.promise;
  }

  createAlarmSourceFromSubscriptionInfo(subscriptionInfo?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var datasources: any = [];
    if (subscriptionInfo.entityId && subscriptionInfo.entityType) {
        this.getEntity(subscriptionInfo.entityType, subscriptionInfo.entityId, {ignoreLoading: true}).then(
            (entity?: any) => {
                this.createDatasourceFromSubscription(subscriptionInfo, datasources, entity);
                var alarmSource: any = datasources[0];
                deferred.resolve(alarmSource);
            },
            function fail() {
                deferred.reject();
            }
        );
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  processSubscriptionsInfo(index?: any, subscriptionsInfo?: any, datasources?: any, deferred?: any, ...rest: any[]): any {
    if (index < subscriptionsInfo.length) {
        var subscriptionInfo: any = this.validateSubscriptionInfo(subscriptionsInfo[index]);
        if (subscriptionInfo.type === types.datasourceType.entity) {
            if (subscriptionInfo.entityId) {
                if (subscriptionInfo.entityName) {
                    var entity: any = {
                        id: {id: subscriptionInfo.entityId, entityType: subscriptionInfo.entityType},
                        name: subscriptionInfo.entityName
                    };
                    this.createDatasourceFromSubscription(subscriptionInfo, datasources, entity);
                    index++;
                    this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
                } else {
                    this.getEntity(subscriptionInfo.entityType, subscriptionInfo.entityId, {ignoreLoading: true}).then(
                        (entity?: any) => {
                            this.createDatasourceFromSubscription(subscriptionInfo, datasources, entity);
                            index++;
                            this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
                        },
                        () => {
                            index++;
                            this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
                        }
                    );
                }
            } else if (subscriptionInfo.entityName || subscriptionInfo.entityNamePrefix
                || subscriptionInfo.entityIds) {
                var promise: any;
                if (subscriptionInfo.entityName) {
                    promise = this.getEntitiesByNameFilter(subscriptionInfo.entityType, subscriptionInfo.entityName, 1, {ignoreLoading: true});
                } else if (subscriptionInfo.entityNamePrefix) {
                    promise = this.getEntitiesByNameFilter(subscriptionInfo.entityType, subscriptionInfo.entityNamePrefix, 100, {ignoreLoading: true});
                } else if (subscriptionInfo.entityIds) {
                    promise = this.getEntities(subscriptionInfo.entityType, subscriptionInfo.entityIds, {ignoreLoading: true});
                }
                promise.then(
                    (entities?: any) => {
                        if (entities && entities.length > 0) {
                            for (var i: any = 0; i < entities.length; i++) {
                                var entity: any = entities[i];
                                this.createDatasourceFromSubscription(subscriptionInfo, datasources, entity);
                            }
                        }
                        index++;
                        this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
                    },
                    () => {
                        index++;
                        this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
                    }
                )
            } else {
                index++;
                this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
            }
        } else if (subscriptionInfo.type === types.datasourceType.function) {
            this.createDatasourceFromSubscription(subscriptionInfo, datasources);
            index++;
            this.processSubscriptionsInfo(index, subscriptionsInfo, datasources, deferred);
        }
    } else {
        deferred.resolve(datasources);
    }
  }

  validateSubscriptionInfo(subscriptionInfo?: any, ...rest: any[]): any {
    if (subscriptionInfo.type === 'device') {
        subscriptionInfo.type = types.datasourceType.entity;
        subscriptionInfo.entityType = types.entityType.device;
        if (subscriptionInfo.deviceId) {
            subscriptionInfo.entityId = subscriptionInfo.deviceId;
        } else if (subscriptionInfo.deviceName) {
            subscriptionInfo.entityName = subscriptionInfo.deviceName;
        } else if (subscriptionInfo.deviceNamePrefix) {
            subscriptionInfo.entityNamePrefix = subscriptionInfo.deviceNamePrefix;
        } else if (subscriptionInfo.deviceIds) {
            subscriptionInfo.entityIds = subscriptionInfo.deviceIds;
        }
    }
    return subscriptionInfo;
  }

  createDatasourceFromSubscription(subscriptionInfo?: any, datasources?: any, entity?: any, ...rest: any[]): any {
    var datasource: any;
    if (subscriptionInfo.type === types.datasourceType.entity) {
        datasource = {
            type: subscriptionInfo.type,
            entityName: entity.name ? entity.name : entity.title,
            name: entity.name ? entity.name : entity.title,
            entityType: subscriptionInfo.entityType,
            entityId: entity.id.id,
            dataKeys: []
        }
    } else if (subscriptionInfo.type === types.datasourceType.function) {
        datasource = {
            type: subscriptionInfo.type,
            name: subscriptionInfo.name || types.datasourceType.function,
            dataKeys: []
        }
    }
    datasources.push(datasource);
    if (subscriptionInfo.timeseries) {
        this.createDatasourceKeys(subscriptionInfo.timeseries, types.dataKeyType.timeseries, datasource, datasources);
    }
    if (subscriptionInfo.attributes) {
        this.createDatasourceKeys(subscriptionInfo.attributes, types.dataKeyType.attribute, datasource, datasources);
    }
    if (subscriptionInfo.functions) {
        this.createDatasourceKeys(subscriptionInfo.functions, types.dataKeyType.function, datasource, datasources);
    }
    if (subscriptionInfo.alarmFields) {
        this.createDatasourceKeys(subscriptionInfo.alarmFields, types.dataKeyType.alarm, datasource, datasources);
    }
  }

  createDatasourceKeys(keyInfos?: any, type?: any, datasource?: any, datasources?: any, ...rest: any[]): any {
    for (var i: any=0;i<keyInfos.length;i++) {
        var keyInfo: any = keyInfos[i];
        var dataKey: any = this.utils.createKey(keyInfo, type, datasources);
        datasource.dataKeys.push(dataKey);
    }
  }

  getRelatedEntities(rootEntityId?: any, entityType?: any, entitySubTypes?: any, maxLevel?: any, keys?: any, typeTranslatePrefix?: any, relationType?: any, direction?: any, fetchLastLevelOnly?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();

    var entitySearchQuery: any = this.constructRelatedEntitiesSearchQuery(rootEntityId, entityType, entitySubTypes, maxLevel, relationType, direction,fetchLastLevelOnly);
    if (!entitySearchQuery) {
        deferred.reject();
    } else {
        var findByQueryPromise: any;
        if (entityType == types.entityType.asset) {
            findByQueryPromise = this.assetService.findByQuery(entitySearchQuery, true, {ignoreLoading: true});
        } else if (entityType == types.entityType.device) {
            findByQueryPromise = this.deviceService.findByQuery(entitySearchQuery, true, {ignoreLoading: true});
        }
        findByQueryPromise.then(
            (entities?: any) => {
                var entitiesTasks: any = [];
                for (var i: any=0;i<entities.length;i++) {
                    var entity: any = entities[i];
                    var entityPromise: any = this.constructEntity(entity, keys, typeTranslatePrefix);
                    entitiesTasks.push(entityPromise);
                }
                Promise.all(entitiesTasks).then(
                    function success(entities?: any) {
                        deferred.resolve(entities);
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            },
            function fail() {
                deferred.reject();
            }
        );
    }
    return deferred.promise;
  }

  saveRelatedEntity(relatedEntity?: any, parentEntityId?: any, keys?: any, relation?: any, direction?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!direction) {
        direction = types.entitySearchDirection.from;
    }
    if (relatedEntity.id.id) {
        this.updateRelatedEntity(relatedEntity, keys, deferred, relation, direction);
    } else {
        this.addRelatedEntity(relatedEntity, parentEntityId, keys, deferred, relation, direction);
    }
    return deferred.promise;
  }

  saveEntityRelation(entityType?: any, entityId?: any, entityRelation?: any, config?: any, ...rest: any[]): any {
    const deferred: any = $q.defer();
    let attributesType: any = Object.keys(types.attributesScope);
    let allPromise: any = [];
    let promise: any = "";
    if (entityRelation.accessToken !== "") {
        promise = this.deviceService.getDeviceCredentials(entityId.id, null, config).then((response?: any) => {
            response.credentialsId = entityRelation.accessToken;
            response.credentialsType = "ACCESS_TOKEN";
            response.credentialsValue = null;
            return this.deviceService.saveDeviceCredentials(response, config).catch(function () {
                return "error";
            });
        });
        allPromise.push(promise)
    }
    for (let i: any = 0; i < attributesType.length; i++) {
        let attribute: any = attributesType[i];
        if (entityRelation.attributes[attribute] && entityRelation.attributes[attribute].length !== 0) {
            promise = this.attributeService.saveEntityAttributes(entityType, entityId.id, types.attributesScope[attribute].value, entityRelation.attributes[attribute], config).catch(function () {
                return "error";
            });
            allPromise.push(promise);
        }
    }
    if (entityRelation.timeseries.length !== 0) {
        promise = this.attributeService.saveEntityTimeseries(entityType, entityId.id, "time", entityRelation.timeseries, config).catch(function(){
            return "error";
        });
        allPromise.push(promise);
    }
    Promise.all(allPromise).then(function success(response?: any) {
        let isResponseHasError: any = false;
        for(let i: any = 0; i < response.length; i++){
            if(response[i] === "error"){
                isResponseHasError = true;
                break;
            }
        }
        isResponseHasError ? deferred.reject() : deferred.resolve();
    });
    return deferred.promise;
  }

  saveEntityParameters(entityType?: any, entityParameters?: any, update?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    const deferred: any = $q.defer();
    let statisticalInfo: any = {};
    let newEntity: any = {
        name: entityParameters.name,
        type: entityParameters.type,
        label: entityParameters.label,
        additionalInfo: {
            description: entityParameters.description
        }
    };

    if (entityType === types.entityType.device && entityParameters.gateway !== null) {
        newEntity.additionalInfo = {
            ...newEntity.additionalInfo,
            gateway: entityParameters.gateway
        };
    }

    let saveEntityPromise: any = this.getEntitySavePromise(entityType, newEntity, config);

    saveEntityPromise.then((response?: any) => {
        this.saveEntityRelation(entityType, response.id, entityParameters, config).then(function success() {
            statisticalInfo.create = {
                entity: 1
            };
            deferred.resolve(statisticalInfo);
        }, function fail() {
            statisticalInfo.error = {
                entity: 1
            };
            deferred.resolve(statisticalInfo);
        });
    }, () => {
        if (update) {
            let findIdEntity: any;
            switch (entityType) {
                case types.entityType.device:
                    findIdEntity = this.deviceService.findByName(entityParameters.name, config);
                    break;
                case types.entityType.asset:
                    findIdEntity = this.assetService.findByName(entityParameters.name, config);
                    break;
            }
            findIdEntity.then((response?: any) => {
                let promises: any = [];
                if(response.label !== entityParameters.label || response.type !== entityParameters.type){
                    response.label = entityParameters.label;
                    response.type = entityParameters.type;
                    promises.push(this.getEntitySavePromise(entityType, response, config));
                }
                promises.push(this.saveEntityRelation(entityType, response.id, entityParameters, config));

                Promise.all(promises).then(function success() {
                    statisticalInfo.update = {
                        entity: 1
                    };
                    deferred.resolve(statisticalInfo);
                }, function fail() {
                    statisticalInfo.error = {
                        entity: 1
                    };
                    deferred.resolve(statisticalInfo);
                });
            }, function fail() {
                statisticalInfo.error = {
                    entity: 1
                };
                deferred.resolve(statisticalInfo);
            });
        } else {
            statisticalInfo.error = {
                entity: 1
            };
            deferred.resolve(statisticalInfo);
        }
    });
    return deferred.promise;
  }

  getEntitySavePromise(entityType?: any, newEntity?: any, config?: any, ...rest: any[]): any {
    let promise: any;
    switch (entityType) {
        case types.entityType.device:
            promise = this.deviceService.saveDevice(newEntity, config);
            break;
        case types.entityType.asset:
            promise = this.assetService.saveAsset(newEntity, true, config);
            break;
    }
    return promise;
  }

  getRelatedEntity(entityId?: any, keys?: any, typeTranslatePrefix?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.getEntityPromise(entityId.entityType, entityId.id, {ignoreLoading: true}).then(
        (entity?: any) => {
            this.constructEntity(entity, keys, typeTranslatePrefix).then(
                function success(relatedEntity?: any) {
                    deferred.resolve(relatedEntity);
                },
                function fail() {
                    deferred.reject();
                }
            );
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  deleteEntityPromise(entityId?: any, ...rest: any[]): any {
    if (entityId.entityType == types.entityType.asset) {
        return this.assetService.deleteAsset(entityId.id);
    } else if (entityId.entityType == types.entityType.device) {
        return this.deviceService.deleteDevice(entityId.id);
    } else if (entityId.entityType == types.entityType.entityView) {
        return this.entityViewService.deleteEntityView(entityId.id);
    }
    return undefined;
  }

  deleteRelatedEntity(entityId?: any, deleteRelatedEntityTypes?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (deleteRelatedEntityTypes) {
        var deleteRelatedEntitiesTasks: any = [];
        this.entityRelationService.findByFrom(entityId.id, entityId.entityType).then(
            (entityRelations?: any) => {
                for (var i: any=0;i<entityRelations.length;i++) {
                    var entityRelation: any = entityRelations[i];
                    var relationEntityId: any = entityRelation.to;
                    if (deleteRelatedEntityTypes.length == 0 || deleteRelatedEntityTypes.indexOf(relationEntityId.entityType) > -1) {
                        var deleteRelatedEntityPromise: any = this.deleteRelatedEntity(relationEntityId, deleteRelatedEntityTypes);
                        deleteRelatedEntitiesTasks.push(deleteRelatedEntityPromise);
                    }
                }
                deleteRelatedEntitiesTasks.push(this.deleteEntityPromise(entityId));
                Promise.all(deleteRelatedEntitiesTasks).then(
                    function success() {
                        deferred.resolve();
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            },
            function fail() {
                deferred.reject();
            }
        )
    } else {
        this.deleteEntityPromise(entityId).then(
            function success() {
                deferred.resolve();
            },
            function fail() {
                deferred.reject();
            }
        );
    }
    return deferred.promise;
  }

  moveEntity(entityId?: any, prevParentId?: any, targetParentId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.entityRelationService.deleteRelation(prevParentId.id, prevParentId.entityType,
        types.entityRelationType.contains, entityId.id, entityId.entityType).then(
        () => {
            var relation: any = {
                from: targetParentId,
                to: entityId,
                type: types.entityRelationType.contains
            };
            this.entityRelationService.saveRelation(relation).then(
                function success() {
                    deferred.resolve();
                },
                function fail() {
                    deferred.reject();
                }
            );
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  copyEntity(entity?: any, targetParentId?: any, keys?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!entity.id && !entity.id.id) {
        deferred.reject();
    } else {
        this.getRelatedEntity(entity.id, keys).then(
            (relatedEntity?: any) => {
                delete relatedEntity.id.id;
                relatedEntity.name = entity.name;
                this.saveRelatedEntity(relatedEntity, targetParentId, keys).then(
                    function success(savedEntity?: any) {
                        deferred.resolve(savedEntity);
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            },
            function fail() {
                deferred.reject();
            }
        );
    }
    return deferred.promise;
  }

  saveEntityPromise(entity?: any, ...rest: any[]): any {
    var entityType: any = entity.id.entityType;
    if (!entity.id.id) {
        delete entity.id;
    }
    if (entityType == types.entityType.asset) {
        return this.assetService.saveAsset(entity);
    } else if (entityType == types.entityType.device) {
        return this.deviceService.saveDevice(entity);
    } else if (entityType == types.entityType.entityView) {
        return this.entityViewService.saveEntityView(entity);
    }
    return undefined;
  }

  addRelatedEntity(relatedEntity?: any, parentEntityId?: any, keys?: any, deferred?: any, relation?: any, direction?: any, ...rest: any[]): any {
    var entity: any = {};
    entity.id = relatedEntity.id;
    entity.name = relatedEntity.name;
    entity.type = relatedEntity.type;
    this.saveEntityPromise(entity).then(
        (entity?: any) => {
            relatedEntity.id = entity.id;
            if (!relation) {
                relation = {
                    type: types.entityRelationType.contains
                };
            }

            if (direction == types.entitySearchDirection.from) {
                relation.from = parentEntityId;
                relation.to = relatedEntity.id;
            } else {
                relation.from = relatedEntity.id;
                relation.to = parentEntityId;
            }

            this.entityRelationService.saveRelation(relation).then(
                () => {
                    this.updateEntity(entity, relatedEntity, keys, deferred, relation);
                },
                function fail() {
                    deferred.reject();
                }
            );
        },
        function fail() {
            deferred.reject();
        }
    );
  }

  updateRelatedEntity(relatedEntity?: any, keys?: any, deferred?: any, relation?: any, direction?: any, ...rest: any[]): any {
    this.getEntityPromise(relatedEntity.id.entityType, relatedEntity.id.id, {ignoreLoading: true}).then(
        (entity?: any) => {
            if (relation) {
                if (direction == types.entitySearchDirection.from) {
                    relation.to = relatedEntity.id;
                } else {
                    relation.from = relatedEntity.id;
                }
                this.entityRelationService.saveRelation(relation).then(
                    () => {
                        this.updateEntity(entity, relatedEntity, keys, deferred);
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            } else {
                this.updateEntity(entity, relatedEntity, keys, deferred);
            }
        },
        function fail() {
            deferred.reject();
        }
    );
  }

  updateEntity(entity?: any, relatedEntity?: any, keys?: any, deferred?: any, ...rest: any[]): any {
    if (entity.name !== relatedEntity.name || entity.type !== relatedEntity.type) {
        entity.name = relatedEntity.name;
        entity.type = relatedEntity.type;
        this.saveEntityPromise(entity).then(
            (entity?: any) => {
                this.updateEntityAttributes(entity, relatedEntity, keys, deferred);
            },
            function fail() {
                deferred.reject();
            }
        );
    } else {
        this.updateEntityAttributes(entity, relatedEntity, keys, deferred);
    }
  }

  updateEntityAttributes(entity?: any, relatedEntity?: any, keys?: any, deferred?: any, ...rest: any[]): any {
    var attributes: any = [];
    for (var i: any = 0; i < keys.length; i++) {
        var key: any = keys[i];
        attributes.push({key: key, value: relatedEntity[key]});
    }
    this.attributeService.saveEntityAttributes(entity.id.entityType, entity.id.id, types.attributesScope.server.value, attributes)
        .then(
            function success() {
                deferred.resolve(relatedEntity);
            },
            function fail() {
                deferred.reject();
            }
        );
  }

  constructRelatedEntitiesSearchQuery(rootEntityId?: any, entityType?: any, entitySubTypes?: any, maxLevel?: any, relationType?: any, direction?: any, fetchLastLevelOnly?: any, ...rest: any[]): any {

    var searchQuery: any = {
        parameters: {
            rootId: rootEntityId.id,
            rootType: rootEntityId.entityType,
            direction: direction,
            fetchLastLevelOnly: !!fetchLastLevelOnly
        },
        relationType: relationType
    };
    if (!direction) {
        searchQuery.parameters.direction = types.entitySearchDirection.from;
    }
    if (!relationType) {
        searchQuery.relationType = types.entityRelationType.contains;
    }

    if (maxLevel) {
        searchQuery.parameters.maxLevel = maxLevel;
    } else {
        searchQuery.parameters.maxLevel = 1;
    }

    if (entityType == types.entityType.asset) {
        searchQuery.assetTypes = entitySubTypes;
    } else if (entityType == types.entityType.device) {
        searchQuery.deviceTypes = entitySubTypes;
    } else if (entityType == types.entityType.entityView) {
        searchQuery.entityViewTypes = entitySubTypes;
    } else {
        return null; //Not supported
    }

    return searchQuery;
  }

  constructEntity(entity?: any, keys?: any, typeTranslatePrefix?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (typeTranslatePrefix) {
        entity.typeName = this.translate.instant(typeTranslatePrefix+'.'+entity.type);
    } else {
        entity.typeName = entity.type;
    }
    this.attributeService.getEntityAttributesValues(entity.id.entityType, entity.id.id,
        types.attributesScope.server.value, keys.join(','),
        {ignoreLoading: true}).then(
        (attributes?: any) => {
            if (attributes && attributes.length > 0) {
                for (var i: any=0;i<keys.length;i++) {
                    var key: any = keys[i];
                    entity[key] = this.getAttributeValue(attributes, key);
                }
            }
            deferred.resolve(entity);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getAttributeValue(attributes?: any, key?: any, ...rest: any[]): any {
    var foundAttributes: any = attributes.filter(function (item: any) { return item.key === key; });
    if (foundAttributes.length > 0) {
        return foundAttributes[0].value;
    } else {
        return null;
    }
    return undefined;
  }
}
