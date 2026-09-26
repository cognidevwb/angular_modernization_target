import { inject, Injectable } from '@angular/core';
import { AttributeService } from '../../api/services/attribute.service';
import { DOCUMENT } from '@angular/common';
import { DashboardService } from '../../api/services/dashboard.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { EntityService } from '../../api/services/entity.service';
import { HttpClient } from '@angular/common/http';
import { ItembufferService } from '../../services/itembuffer.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import { bindMethods } from '../../../bind-methods';
import JSZip from 'jszip/dist/jszip.min.js';
import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let scope: any;

/**
 * Ported from the AngularJS factory `importExport` (module `thingsboard.importexport`) in src/app/import-export/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 5 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class ImportExportService {
  private readonly __bound = bindMethods(this);
  private readonly translate = inject(TranslateService);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly dialog = inject(MatDialog);
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly itembuffer = inject(ItembufferService);
  private readonly utils = inject(UtilsService);
  private readonly rootScope = inject(RootState);
  private readonly dashboardUtils = inject(DashboardUtilsService);
  private readonly entityService = inject(EntityService);
  private readonly dashboardService = inject(DashboardService);
  private readonly ruleChainService = inject(RuleChainService);
  private readonly widgetService = inject(WidgetService);
  private readonly toast = inject(ToastService);
  private readonly attributeService = inject(AttributeService);

  private ZIP_TYPE: any = {
        mimeType: 'application/zip',
        extension: 'zip'
    };

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method
  // TODO(port): angular.merge — angular.merge: a deep merge; write one or use a library

  exportWidgetsBundle(widgetsBundleId?: any, ...rest: any[]): any {
    this.widgetService.getWidgetsBundle(widgetsBundleId).then(
        (widgetsBundle?: any) => {
            var bundleAlias: any = widgetsBundle.alias;
            var isSystem: any = widgetsBundle.tenantId.id === types.id.nullUid;
            this.widgetService.getBundleWidgetTypes(bundleAlias, isSystem).then(
                (widgetTypes?: any) => {
                    this.prepareExport(widgetsBundle);
                    var widgetsBundleItem: any = {
                        widgetsBundle: this.prepareExport(widgetsBundle),
                        widgetTypes: []
                    };
                    for (var t in widgetTypes) {
                        var widgetType: any = widgetTypes[t];
                        if ((widgetType.bundleAlias !== undefined)) {
                            delete widgetType.bundleAlias;
                        }
                        widgetsBundleItem.widgetTypes.push(this.prepareExport(widgetType));
                    }
                    var name: any = widgetsBundle.title;
                    name = name.toLowerCase().replace(/\W/g, "_");
                    this.exportToPc(widgetsBundleItem, name + '.json');
                },
                (rejection?: any) => {
                    var message: any = rejection;
                    if (!message) {
                        message = this.translate.instant('error.unknown-error');
                    }
                    this.toast.showError(this.translate.instant('widgets-bundle.export-failed-error', {error: message}));
                }
            );
        },
        (rejection?: any) => {
            var message: any = rejection;
            if (!message) {
                message = this.translate.instant('error.unknown-error');
            }
            this.toast.showError(this.translate.instant('widgets-bundle.export-failed-error', {error: message}));
        }
    );
  }

  importNextWidgetType(widgetTypes?: any, bundleAlias?: any, index?: any, deferred?: any, ...rest: any[]): any {
    if (!widgetTypes || widgetTypes.length <= index) {
        deferred.resolve();
    } else {
        var widgetType: any = widgetTypes[index];
        widgetType.bundleAlias = bundleAlias;
        this.widgetService.saveImportedWidgetType(widgetType).then(
            () => {
                index++;
                this.importNextWidgetType(widgetTypes, bundleAlias, index, deferred);
            },
            function fail() {
                deferred.reject();
            }
        );

    }
  }

  importWidgetsBundle($event?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.openImportDialog($event, 'widgets-bundle.import', 'widgets-bundle.widgets-bundle-file').then(
        (widgetsBundleItem?: any) => {
            if (!this.validateImportedWidgetsBundle(widgetsBundleItem)) {
                this.toast.showError(this.translate.instant('widgets-bundle.invalid-widgets-bundle-file-error'));
                deferred.reject();
            } else {
                var widgetsBundle: any = widgetsBundleItem.widgetsBundle;
                this.widgetService.saveWidgetsBundle(widgetsBundle).then(
                    (savedWidgetsBundle?: any) => {
                        var bundleAlias: any = savedWidgetsBundle.alias;
                        var widgetTypes: any = widgetsBundleItem.widgetTypes;
                        this.importNextWidgetType(widgetTypes, bundleAlias, 0, deferred);
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  validateImportedWidgetsBundle(widgetsBundleItem?: any, ...rest: any[]): any {
    if ((widgetsBundleItem.widgetsBundle === undefined)) {
        return false;
    }
    if ((widgetsBundleItem.widgetTypes === undefined)) {
        return false;
    }
    var widgetsBundle: any = widgetsBundleItem.widgetsBundle;
    if ((widgetsBundle.title === undefined)) {
        return false;
    }
    var widgetTypes: any = widgetsBundleItem.widgetTypes;
    for (var t in widgetTypes) {
        var widgetType: any = widgetTypes[t];
        if (!this.validateImportedWidgetType(widgetType)) {
            return false;
        }
    }

    return true;
  }

  exportWidgetType(widgetTypeId?: any, ...rest: any[]): any {
    this.widgetService.getWidgetTypeById(widgetTypeId).then(
        (widgetType?: any) => {
            if ((widgetType.bundleAlias !== undefined)) {
                delete widgetType.bundleAlias;
            }
            var name: any = widgetType.name;
            name = name.toLowerCase().replace(/\W/g, "_");
            this.exportToPc(this.prepareExport(widgetType), name + '.json');
        },
        (rejection?: any) => {
            var message: any = rejection;
            if (!message) {
                message = this.translate.instant('error.unknown-error');
            }
            this.toast.showError(this.translate.instant('widget-type.export-failed-error', {error: message}));
        }
    );
  }

  importWidgetType($event?: any, bundleAlias?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.openImportDialog($event, 'widget-type.import', 'widget-type.widget-type-file').then(
        (widgetType?: any) => {
            if (!this.validateImportedWidgetType(widgetType)) {
                this.toast.showError(this.translate.instant('widget-type.invalid-widget-type-file-error'));
                deferred.reject();
            } else {
                widgetType.bundleAlias = bundleAlias;
                this.widgetService.saveImportedWidgetType(widgetType).then(
                    function success() {
                        deferred.resolve();
                    },
                    function fail() {
                        deferred.reject();
                    }
                );
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  validateImportedWidgetType(widgetType?: any, ...rest: any[]): any {
    if ((widgetType.name === undefined)
        || (widgetType.descriptor === undefined)) {
        return false;
    }
    return true;
  }

  exportRuleChain(ruleChainId?: any, ...rest: any[]): any {
    this.ruleChainService.getRuleChain(ruleChainId).then(
        (ruleChain?: any) => {
            this.ruleChainService.getRuleChainMetaData(ruleChainId).then(
                (ruleChainMetaData?: any) => {
                    var ruleChainExport: any = {
                        ruleChain: this.prepareRuleChain(ruleChain),
                        metadata: this.prepareRuleChainMetaData(ruleChainMetaData)
                    };
                    var name: any = ruleChain.name;
                    name = name.toLowerCase().replace(/\W/g, "_");
                    this.exportToPc(ruleChainExport, name + '.json');
                },
                (rejection?: any) => {
                    this.processExportRuleChainRejection(rejection);
                }
            );
        },
        (rejection?: any) => {
            this.processExportRuleChainRejection(rejection);
        }
    );
  }

  prepareRuleChain(ruleChain?: any, ...rest: any[]): any {
    ruleChain = this.prepareExport(ruleChain);
    if (ruleChain.firstRuleNodeId) {
        ruleChain.firstRuleNodeId = null;
    }
    ruleChain.root = false;
    return ruleChain;
  }

  prepareRuleChainMetaData(ruleChainMetaData?: any, ...rest: any[]): any {
    delete ruleChainMetaData.ruleChainId;
    for (var i: any = 0; i < ruleChainMetaData.nodes.length; i++) {
        var node: any = ruleChainMetaData.nodes[i];
        delete node.ruleChainId;
        ruleChainMetaData.nodes[i] = this.prepareExport(node);
    }
    return ruleChainMetaData;
  }

  processExportRuleChainRejection(rejection?: any, ...rest: any[]): any {
    var message: any = rejection;
    if (!message) {
        message = this.translate.instant('error.unknown-error');
    }
    this.toast.showError(this.translate.instant('rulechain.export-failed-error', {error: message}));
  }

  importRuleChain($event?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.openImportDialog($event, 'rulechain.import', 'rulechain.rulechain-file').then(
        (ruleChainImport?: any) => {
            if (!this.validateImportedRuleChain(ruleChainImport)) {
                this.toast.showError(this.translate.instant('rulechain.invalid-rulechain-file-error'));
                deferred.reject();
            } else {
                deferred.resolve(ruleChainImport);
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  validateImportedRuleChain(ruleChainImport?: any, ...rest: any[]): any {
    if ((ruleChainImport.ruleChain === undefined)) {
        return false;
    }
    if ((ruleChainImport.metadata === undefined)) {
        return false;
    }
    if ((ruleChainImport.ruleChain.name === undefined)) {
        return false;
    }
    return true;
  }

  exportWidget(dashboard?: any, sourceState?: any, sourceLayout?: any, widget?: any, ...rest: any[]): any {
    var widgetItem: any = this.itembuffer.prepareWidgetItem(dashboard, sourceState, sourceLayout, widget);
    var name: any = widgetItem.widget.config.title;
    name = name.toLowerCase().replace(/\W/g, "_");
    this.exportToPc(this.prepareExport(widgetItem), name + '.json');
  }

  prepareAliasesInfo(aliasesInfo?: any, ...rest: any[]): any {
    var datasourceAliases: any = aliasesInfo.datasourceAliases;
    var targetDeviceAliases: any = aliasesInfo.targetDeviceAliases;
    var datasourceIndex: any;
    if (datasourceAliases || targetDeviceAliases) {
        if (datasourceAliases) {
            for (datasourceIndex in datasourceAliases) {
                datasourceAliases[datasourceIndex] = this.prepareEntityAlias(datasourceAliases[datasourceIndex]);
            }
        }
        if (targetDeviceAliases) {
            for (datasourceIndex in targetDeviceAliases) {
                targetDeviceAliases[datasourceIndex] = this.prepareEntityAlias(targetDeviceAliases[datasourceIndex]);
            }
        }
    }
    return aliasesInfo;
  }

  prepareEntityAlias(aliasInfo?: any, ...rest: any[]): any {
    var alias: any;
    var filter: any;
    if (aliasInfo.deviceId) {
        alias = aliasInfo.aliasName;
        filter = {
            type: types.aliasFilterType.entityList.value,
            entityType: types.entityType.device,
            entityList: [aliasInfo.deviceId],
            resolveMultiple: false
        };
    } else if (aliasInfo.deviceFilter) {
        alias = aliasInfo.aliasName;
        filter = {
            type: aliasInfo.deviceFilter.useFilter ? types.aliasFilterType.entityName.value : types.aliasFilterType.entityList.value,
            entityType: types.entityType.device,
            resolveMultiple: false
        }
        if (filter.type == types.aliasFilterType.entityList.value) {
            filter.entityList = aliasInfo.deviceFilter.deviceList
        } else {
            filter.entityNameFilter = aliasInfo.deviceFilter.deviceNameFilter;
        }
    } else if (aliasInfo.entityFilter) {
        alias = aliasInfo.aliasName;
        filter = {
            type: aliasInfo.entityFilter.useFilter ? types.aliasFilterType.entityName.value : types.aliasFilterType.entityList.value,
            entityType: aliasInfo.entityType,
            resolveMultiple: false
        }
        if (filter.type == types.aliasFilterType.entityList.value) {
            filter.entityList = aliasInfo.entityFilter.entityList;
        } else {
            filter.entityNameFilter = aliasInfo.entityFilter.entityNameFilter;
        }
    } else {
        alias = aliasInfo.alias;
        filter = aliasInfo.filter;
    }
    return {
        alias: alias,
        filter: filter
    };
  }

  importWidget($event?: any, dashboard?: any, targetState?: any, targetLayoutFunction?: any, onAliasesUpdateFunction?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.openImportDialog($event, 'dashboard.import-widget', 'dashboard.widget-file').then(
        (widgetItem?: any) => {
            if (!this.validateImportedWidget(widgetItem)) {
                this.toast.showError(this.translate.instant('dashboard.invalid-widget-file-error'));
                deferred.reject();
            } else {
                var widget: any = widgetItem.widget;
                widget = this.dashboardUtils.validateAndUpdateWidget(widget);
                var aliasesInfo: any = this.prepareAliasesInfo(widgetItem.aliasesInfo);
                var originalColumns: any = widgetItem.originalColumns;
                var originalSize: any = widgetItem.originalSize;

                var datasourceAliases: any = aliasesInfo.datasourceAliases;
                var targetDeviceAliases: any = aliasesInfo.targetDeviceAliases;
                if (datasourceAliases || targetDeviceAliases) {
                    var entityAliases: any = {};
                    var datasourceAliasesMap: any = {};
                    var targetDeviceAliasesMap: any = {};
                    var aliasId: any;
                    var datasourceIndex: any;
                    if (datasourceAliases) {
                        for (datasourceIndex in datasourceAliases) {
                            aliasId = this.utils.guid();
                            datasourceAliasesMap[aliasId] = datasourceIndex;
                            entityAliases[aliasId] = datasourceAliases[datasourceIndex];
                            entityAliases[aliasId].id = aliasId;
                        }
                    }
                    if (targetDeviceAliases) {
                        for (datasourceIndex in targetDeviceAliases) {
                            aliasId = this.utils.guid();
                            targetDeviceAliasesMap[aliasId] = datasourceIndex;
                            entityAliases[aliasId] = targetDeviceAliases[datasourceIndex];
                            entityAliases[aliasId].id = aliasId;
                        }
                    }

                    var aliasIds: any = Object.keys(entityAliases);
                    if (aliasIds.length > 0) {
                        this.processEntityAliases(entityAliases, aliasIds).then(
                            (missingEntityAliases?: any) => {
                                if (Object.keys(missingEntityAliases).length > 0) {
                                    this.editMissingAliases($event, [widget],
                                        true, 'dashboard.widget-import-missing-aliases-title', missingEntityAliases).then(
                                        (updatedEntityAliases?: any) => {
                                            for (var aliasId in updatedEntityAliases) {
                                                var entityAlias: any = updatedEntityAliases[aliasId];
                                                var datasourceIndex: any;
                                                if (datasourceAliasesMap[aliasId]) {
                                                    datasourceIndex = datasourceAliasesMap[aliasId];
                                                    datasourceAliases[datasourceIndex] = entityAlias;
                                                } else if (targetDeviceAliasesMap[aliasId]) {
                                                    datasourceIndex = targetDeviceAliasesMap[aliasId];
                                                    targetDeviceAliases[datasourceIndex] = entityAlias;
                                                }
                                            }
                                            this.addImportedWidget(dashboard, targetState, targetLayoutFunction, $event, widget,
                                                aliasesInfo, onAliasesUpdateFunction, originalColumns, originalSize, deferred);
                                        },
                                        function fail() {
                                            deferred.reject();
                                        }
                                    );
                                } else {
                                    this.addImportedWidget(dashboard, targetState, targetLayoutFunction, $event, widget,
                                        aliasesInfo, onAliasesUpdateFunction, originalColumns, originalSize, deferred);
                                }
                            }
                        );
                    } else {
                        this.addImportedWidget(dashboard, targetState, targetLayoutFunction, $event, widget,
                            aliasesInfo, onAliasesUpdateFunction, originalColumns, originalSize, deferred);
                    }
                } else {
                    this.addImportedWidget(dashboard, targetState, targetLayoutFunction, $event, widget,
                        aliasesInfo, onAliasesUpdateFunction, originalColumns, originalSize, deferred);
                }
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  validateImportedWidget(widgetItem?: any, ...rest: any[]): any {
    if ((widgetItem.widget === undefined)
        || (widgetItem.aliasesInfo === undefined)
        || (widgetItem.originalColumns === undefined)) {
        return false;
    }
    var widget: any = widgetItem.widget;
    if ((widget.isSystemType === undefined) ||
        (widget.bundleAlias === undefined) ||
        (widget.typeAlias === undefined) ||
        (widget.type === undefined)) {
        return false;
    }
    return true;
  }

  addImportedWidget(dashboard?: any, targetState?: any, targetLayoutFunction?: any, event?: any, widget?: any, aliasesInfo?: any, onAliasesUpdateFunction?: any, originalColumns?: any, originalSize?: any, deferred?: any, ...rest: any[]): any {
    targetLayoutFunction(event).then(
        (targetLayout?: any) => {
            this.itembuffer.addWidgetToDashboard(dashboard, targetState, targetLayout, widget,
                aliasesInfo, onAliasesUpdateFunction, originalColumns, originalSize, -1, -1).then(
                function () {
                    deferred.resolve(
                        {
                            widget: widget,
                            layoutId: targetLayout
                        }
                    );
                }
            );
        },
        function fail() {
            deferred.reject();
        }
    );
  }

  exportDashboard(dashboardId?: any, ...rest: any[]): any {
    this.dashboardService.getDashboard(dashboardId).then(
        (dashboard?: any) => {
            var name: any = dashboard.title;
            name = name.toLowerCase().replace(/\W/g, "_");
            this.exportToPc(this.prepareDashboardExport(dashboard), name + '.json');
        },
        (rejection?: any) => {
            var message: any = rejection;
            if (!message) {
                message = this.translate.instant('error.unknown-error');
            }
            this.toast.showError(this.translate.instant('dashboard.export-failed-error', {error: message}));
        }
    );
  }

  prepareDashboardExport(dashboard?: any, ...rest: any[]): any {
    dashboard = this.prepareExport(dashboard);
    delete dashboard.assignedCustomers;
    delete dashboard.publicCustomerId;
    delete dashboard.assignedCustomersText;
    delete dashboard.assignedCustomersIds;
    return dashboard;
  }

  importDashboard($event?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.openImportDialog($event, 'dashboard.import', 'dashboard.dashboard-file').then(
        (dashboard?: any) => {
            if (!this.validateImportedDashboard(dashboard)) {
                this.toast.showError(this.translate.instant('dashboard.invalid-dashboard-file-error'));
                deferred.reject();
            } else {
                dashboard = this.dashboardUtils.validateAndUpdateDashboard(dashboard);
                var entityAliases: any = dashboard.configuration.entityAliases;
                if (entityAliases) {
                    var aliasIds: any = Object.keys(entityAliases);
                    if (aliasIds.length > 0) {
                        this.processEntityAliases(entityAliases, aliasIds).then(
                            (missingEntityAliases?: any) => {
                                if (Object.keys(missingEntityAliases).length > 0) {
                                    this.editMissingAliases($event, dashboard.configuration.widgets,
                                        false, 'dashboard.dashboard-import-missing-aliases-title', missingEntityAliases).then(
                                        (updatedEntityAliases?: any) => {
                                            for (var aliasId in updatedEntityAliases) {
                                                entityAliases[aliasId] = updatedEntityAliases[aliasId];
                                            }
                                            this.saveImportedDashboard(dashboard, deferred);
                                        },
                                        function fail() {
                                            deferred.reject();
                                        }
                                    );
                                } else {
                                    this.saveImportedDashboard(dashboard, deferred);
                                }
                            }
                        )
                    } else {
                        this.saveImportedDashboard(dashboard, deferred);
                    }
                } else {
                    this.saveImportedDashboard(dashboard, deferred);
                }
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  importEntities($event?: any, entityType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();

    switch (entityType) {
        case types.entityType.device:
            this.openImportDialogCSV($event, entityType, 'device.import', 'device.device-file').then(
                function success() {
                    deferred.resolve();
                },
                function fail() {
                    deferred.reject();
                }
            );
            return deferred.promise;
        case types.entityType.asset:
            this.openImportDialogCSV($event, entityType, 'asset.import', 'asset.asset-file').then(
                function success() {
                    deferred.resolve();
                },
                function fail() {
                    deferred.reject();
                }
            );
            return deferred.promise;
    }

    return undefined;
  }

  saveImportedDashboard(dashboard?: any, deferred?: any, ...rest: any[]): any {
    this.dashboardService.saveDashboard(dashboard).then(
        function success() {
            deferred.resolve();
        },
        function fail() {
            deferred.reject();
        }
    )
  }

  validateImportedDashboard(dashboard?: any, ...rest: any[]): any {
    if ((dashboard.title === undefined) || (dashboard.configuration === undefined)) {
        return false;
    }
    return true;
  }

  exportExtension(extensionId?: any, ...rest: any[]): any {
    const getExtension = (extensionId?: any): any => {
        var deferred: any = $q.defer();
        var url: any = '/api/plugins/telemetry/DEVICE/' + extensionId;
        this.http.get(url)
    this.http.get(url)
        .toPromise().then(function success(response?: any) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    getExtension(extensionId)
        .then(
            (extension?: any) => {
                var name: any = extension.title;
                name = name.toLowerCase().replace(/\W/g, "_");
                this.exportToPc(this.prepareExport(extension), name + '.json');
            },
            (rejection?: any) => {
                var message: any = rejection;
                if (!message) {
                    message = this.translate.instant('error.unknown-error');
                }
                this.toast.showError(this.translate.instant('extension.export-failed-error', {error: message}));
            }
        );



  }

  importExtension($event?: any, options?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.openImportDialog($event, 'extension.import-extensions', 'extension.file')
        .then(
            (extension?: any) => {
                if (!this.validateImportedExtension(extension)) {
                    this.toast.showError(this.translate.instant('extension.invalid-file-error'));
                    deferred.reject();
                } else {
                    this.attributeService
                        .saveEntityAttributes(
                            options.entityType,
                            options.entityId,
                            types.attributesScope.shared.value,
                            [{
                                key: "configuration",
                                value: JSON.stringify(extension)
                            }]
                        )
                        .then(function success() {
                            options.successFunc();
                        });
                }
            },
            function fail() {
                deferred.reject();
            }
        );
    return deferred.promise;
  }

  validateImportedExtension(configuration?: any, ...rest: any[]): any {
    if (configuration.length) {
        for (let i: any = 0; i < configuration.length; i++) {
            if ((configuration[i].configuration === undefined) || (configuration[i].id === undefined) || (configuration[i].type === undefined)) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
  }

  processEntityAliases(entityAliases?: any, aliasIds?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var missingEntityAliases: any = {};
    var index: any = -1;
    this.checkNextEntityAliasOrComplete(index, aliasIds, entityAliases, missingEntityAliases, deferred);
    return deferred.promise;
  }

  checkNextEntityAliasOrComplete(index?: any, aliasIds?: any, entityAliases?: any, missingEntityAliases?: any, deferred?: any, ...rest: any[]): any {
    index++;
    if (index == aliasIds.length) {
        deferred.resolve(missingEntityAliases);
    } else {
        this.checkEntityAlias(index, aliasIds, entityAliases, missingEntityAliases, deferred);
    }
  }

  checkEntityAlias(index?: any, aliasIds?: any, entityAliases?: any, missingEntityAliases?: any, deferred?: any, ...rest: any[]): any {
    var aliasId: any = aliasIds[index];
    var entityAlias: any = entityAliases[aliasId];
    this.entityService.checkEntityAlias(entityAlias).then(
        (result?: any) => {
            if (result) {
                this.checkNextEntityAliasOrComplete(index, aliasIds, entityAliases, missingEntityAliases, deferred);
            } else {
                var missingEntityAlias: any = structuredClone(entityAlias);
                missingEntityAlias.filter = null;
                missingEntityAliases[aliasId] = missingEntityAlias;
                this.checkNextEntityAliasOrComplete(index, aliasIds, entityAliases, missingEntityAliases, deferred);
            }
        }
    );
  }

  editMissingAliases($event?: any, widgets?: any, isSingleWidget?: any, customTitle?: any, missingEntityAliases?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    (this.dialog as any).show({
        controller: 'EntityAliasesController',
        controllerAs: 'vm',
        templateUrl: 'entity-aliases.tpl.html',
        locals: {
            config: {
                entityAliases: missingEntityAliases,
                widgets: widgets,
                isSingleWidget: isSingleWidget,
                customTitle: customTitle,
                disableAdd: true
            }
        },
        parent: $(this.document.body),
        multiple: true,
        fullscreen: true,
        targetEvent: $event
    }).then(function (updatedEntityAliases?: any) {
        deferred.resolve(updatedEntityAliases);
    }, function () {
        deferred.reject();
    });
    return deferred.promise;
  }

  splitCSV(str?: any, sep?: any, ...rest: any[]): any {
    for (var foo: any = str.split(sep = sep || ","), x: any = foo.length - 1, tl: any; x >= 0; x--) {
        if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
            if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
                foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
            } else if (x) {
                foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
            } else foo = foo.shift().split(sep).concat(foo);
        } else foo[x].replace(/""/g, '"');
    }
    return foo;
  }

  isNumeric(str?: any, ...rest: any[]): any {
    str = str.replace(',', '.');
    return !isNaN(parseFloat(str)) && isFinite(str);
  }

  convertStringToJSType(str?: any, ...rest: any[]): any {
    if (this.isNumeric(str.replace(',', '.'))) {
        return parseFloat(str.replace(',', '.'));
    }
    if (str.search(/^(true|false)$/im) === 0) {
        return str === 'true';
    }
    if (str === "") {
        return null;
    }
    return str;
  }

  convertCSVToJson(csvdata?: any, config?: any, ...rest: any[]): any {
    config = config || {};
    const delim: any = config.delim || ",";
    const header: any = config.header || false;
    let result: any = {};

    let csvlines: any = csvdata.split(/[\r\n]+/);
    let csvheaders: any = this.splitCSV(csvlines[0], delim);
    if (csvheaders.length < 2) {
        this.toast.showError(this.translate.instant('import.import-csv-number-columns-error'));
        return -1;
    }
    let csvrows: any = header ? csvlines.slice(1, csvlines.length) : csvlines;

    result.headers = csvheaders;
    result.rows = [];

    for (let r in csvrows) {
        if (Object.prototype.hasOwnProperty.call(csvrows, r)) {
            let row: any = csvrows[r];

            if (row.length === 0)
                break;

            let rowitems: any = this.splitCSV(row, delim);
            if (rowitems.length !== result.headers.length) {
                this.toast.showError(this.translate.instant('import.import-csv-invalid-format-error', {line: (header ? result.rows.length + 2: result.rows.length + 1)}));
                return -1;
            }
            for (let i: any = 0; i < rowitems.length; i++) {
                rowitems[i] = this.convertStringToJSType(rowitems[i]);
            }
            result.rows.push(rowitems);
        }
    }
    return result;
  }

  sumObject(obj1?: any, obj2?: any, ...rest: any[]): any {
    Object.keys(obj2).map((key?: any) => {
        if (typeof obj2[key] === 'object' && obj2[key] !== null) {
            obj1[key] = obj1[key] || {};
            Object.assign(obj1[key], this.sumObject(obj1[key], obj2[key]));
        } else {
            obj1[key] = (obj1[key] || 0) + obj2[key];
        }
    });
    return obj1;
  }

  qAllWithProgress(promises?: any, ...rest: any[]): any {
    promises.forEach((p?: any) => {
        p.then(() => {
            this.rootScope.$broadcast('createImportEntityCompleted', {});
        });
    });
    return Promise.all(promises);
  }

  createMultiEntity(arrayData?: any, entityType?: any, updateData?: any, config?: any, ...rest: any[]): any {
    let partSize: any = 100;
    partSize = arrayData.length > partSize ? partSize : arrayData.length;
    let allPromise: any = [];
    let statisticalInfo: any = {};
    let deferred: any = $q.defer();

    for(let i: any = 0; i < partSize; i++){
        const promise: any = this.entityService.saveEntityParameters(entityType, arrayData[i], updateData, config);
        allPromise.push(promise);
    }

    this.qAllWithProgress(allPromise).then((response?: any) => {
        for (let i: any = 0; i < response.length; i++){
            statisticalInfo = this.sumObject(statisticalInfo, response[i]);
        }
        arrayData.splice(0, partSize);
        if(arrayData.length > 0){
            deferred.resolve(this.createMultiEntity(arrayData, entityType, updateData, config).then((response?: any) => {
                return this.sumObject(statisticalInfo, response);
            }));
        } else {
            deferred.resolve(statisticalInfo);
        }
    });
    return deferred.promise;
  }

  prepareExport(data?: any, ...rest: any[]): any {
    var exportedData: any = structuredClone(data);
    if ((exportedData.id !== undefined)) {
        delete exportedData.id;
    }
    if ((exportedData.createdTime !== undefined)) {
        delete exportedData.createdTime;
    }
    if ((exportedData.tenantId !== undefined)) {
        delete exportedData.tenantId;
    }
    if ((exportedData.customerId !== undefined)) {
        delete exportedData.customerId;
    }
    return exportedData;
  }

  exportToPc(data?: any, filename?: any, ...rest: any[]): any {
    if (!data) {
        console.error('No data');
        return;
    }

    if (!filename) {
        filename = 'download.json';
    }

    if (typeof data === 'object' && data !== null) {
        data = JSON.stringify(data, null, 2);
    }

    var blob: any = new Blob([data], {type: 'text/json'});

    // FOR IE:

    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
        var e: any = document.createEvent('MouseEvents'),
            a: any = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
  }

  openImportDialog($event?: any, importTitle?: any, importFileLabel?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    (this.dialog as any).show({
        controller: 'ImportDialogController',
        controllerAs: 'vm',
        templateUrl: 'import-dialog.tpl.html',
        locals: {
            importTitle: importTitle,
            importFileLabel: importFileLabel
        },
        parent: $(this.document.body),
        multiple: true,
        fullscreen: true,
        targetEvent: $event
    }).then(function (importData?: any) {
        deferred.resolve(importData);
    }, function () {
        deferred.reject();
    });
    return deferred.promise;
  }

  openImportDialogCSV($event?: any, entityType?: any, importTitle?: any, importFileLabel?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    (this.dialog as any).show({
        controller: 'ImportDialogCSVController',
        controllerAs: 'vm',
        templateUrl: 'import-dialog-csv.tpl.html',
        locals: {
            importTitle: importTitle,
            importFileLabel: importFileLabel,
            entityType: entityType
        },
        parent: $(this.document.body),
        onComplete: this.fixedDialogSize,
        multiple: true,
        fullscreen: true,
        targetEvent: $event
    }).then(function () {
        deferred.resolve();
    }, function () {
        deferred.reject();
    });
    return deferred.promise;
  }

  fixedDialogSize = (_scope?: any, element?: any, ...rest: any[]): any => {
    let dialogElement: any = element[0].getElementsByTagName('md-dialog');
    dialogElement[0].style.width = dialogElement[0].offsetWidth + 2 + "px";
  };

  exportJSZip(data?: any, filename?: any, ...rest: any[]): any {
    let jsZip: any = new (JSZip as any)();
    for (let keyName in data) {
        let valueData: any = data[keyName];
        jsZip.file(keyName, valueData);
    }
    jsZip.generateAsync({type: "blob"}).then((content?: any) => {
        this.downloadFile(content, filename, this.ZIP_TYPE);
    });
  }

  downloadFile(data?: any, filename?: any, fileType?: any, ...rest: any[]): any {
    if (!filename) {
        filename = 'download';
    }
    filename += '.' + fileType.extension;
    var blob: any = new Blob([data], {type: fileType.mimeType});
    // FOR IE:
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
        var e: any = document.createEvent('MouseEvents'),
            a: any = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType.mimeType, a.download, a.href].join(':');
        e.initEvent('click', true, false, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
  }
}
