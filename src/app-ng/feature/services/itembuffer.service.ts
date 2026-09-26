import { inject, Injectable } from '@angular/core';
import { BufferStoreService } from './buffer-store.service';
import { DashboardUtilsService } from '../common/services/dashboard-utils.service';
import { RuleChainService } from '../api/services/rule-chain.service';
import { UtilsService } from '../common/services/utils.service';
import { types } from '../common/constants/types';
import { bindMethods } from '../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $q: any;

/**
 * Ported from the AngularJS factory `itembuffer` (module `thingsboard.itembuffer`) in src/app/services/item-buffer.service.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class ItembufferService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly bufferStore: any = inject(BufferStoreService);
  private readonly dashboardUtils = inject(DashboardUtilsService);
  private readonly ruleChainService = inject(RuleChainService);
  private readonly utils = inject(UtilsService);
  // TODO(port): `BufferStoreService` has no `get`, `set`: the AngularJS `bufferStore` had; add or map them

  private WIDGET_ITEM: any = "widget_item";
  private WIDGET_REFERENCE: any = "widget_reference";
  private RULE_NODES: any = "rule_nodes";

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  prepareAliasInfo(entityAlias?: any, ...rest: any[]): any {
    return {
        alias: entityAlias.alias,
        filter: entityAlias.filter
    };
  }

  getOriginalColumns(dashboard?: any, sourceState?: any, sourceLayout?: any, ...rest: any[]): any {
    var originalColumns: any = 24;
    var gridSettings: any = null;
    var state: any = dashboard.configuration.states[sourceState];
    var layoutCount: any = Object.keys(state.layouts).length;
    if (state) {
        var layout: any = state.layouts[sourceLayout];
        if (layout) {
            gridSettings = layout.gridSettings;

        }
    }
    if (gridSettings &&
        gridSettings.columns) {
        originalColumns = gridSettings.columns;
    }
    originalColumns = originalColumns * layoutCount;
    return originalColumns;
  }

  getOriginalSize(dashboard?: any, sourceState?: any, sourceLayout?: any, widget?: any, ...rest: any[]): any {
    var layout: any = dashboard.configuration.states[sourceState].layouts[sourceLayout];
    var widgetLayout: any = layout.widgets[widget.id];
    return {
        sizeX: widgetLayout.sizeX,
        sizeY: widgetLayout.sizeY
    }
  }

  prepareWidgetItem(dashboard?: any, sourceState?: any, sourceLayout?: any, widget?: any, ...rest: any[]): any {
    var aliasesInfo: any = {
        datasourceAliases: {},
        targetDeviceAliases: {}
    };
    var originalColumns: any = this.getOriginalColumns(dashboard, sourceState, sourceLayout);
    var originalSize: any = this.getOriginalSize(dashboard, sourceState, sourceLayout, widget);
    if (widget.config && dashboard.configuration
        && dashboard.configuration.entityAliases) {
        var entityAlias: any;
        if (widget.config.datasources) {
            for (var i: any=0;i<widget.config.datasources.length;i++) {
                var datasource: any = widget.config.datasources[i];
                if (datasource.type === types.datasourceType.entity && datasource.entityAliasId) {
                    entityAlias = dashboard.configuration.entityAliases[datasource.entityAliasId];
                    if (entityAlias) {
                        aliasesInfo.datasourceAliases[i] = this.prepareAliasInfo(entityAlias);
                    }
                }
            }
        }
        if (widget.config.targetDeviceAliasIds) {
            for (i=0;i<widget.config.targetDeviceAliasIds.length;i++) {
                var targetDeviceAliasId: any = widget.config.targetDeviceAliasIds[i];
                if (targetDeviceAliasId) {
                    entityAlias = dashboard.configuration.entityAliases[targetDeviceAliasId];
                    if (entityAlias) {
                        aliasesInfo.targetDeviceAliases[i] = this.prepareAliasInfo(entityAlias);
                    }
                }
            }
        }
    }
    return {
        widget: widget,
        aliasesInfo: aliasesInfo,
        originalSize: originalSize,
        originalColumns: originalColumns
    };
  }

  prepareWidgetReference(dashboard?: any, sourceState?: any, sourceLayout?: any, widget?: any, ...rest: any[]): any {
    var originalColumns: any = this.getOriginalColumns(dashboard, sourceState, sourceLayout);
    var originalSize: any = this.getOriginalSize(dashboard, sourceState, sourceLayout, widget);

    return {
        dashboardId: dashboard.id.id,
        sourceState: sourceState,
        sourceLayout: sourceLayout,
        widgetId: widget.id,
        originalSize: originalSize,
        originalColumns: originalColumns
    };
  }

  copyRuleNodes(nodes?: any, connections?: any, ...rest: any[]): any {
    var ruleNodes: any = {
        nodes: [],
        connections: []
    };
    var top: any = -1, left: any = -1, bottom: any = -1, right: any = -1;
    for (var i: any=0;i<nodes.length;i++) {
        var origNode: any = nodes[i];
        var node: any = {
            additionalInfo: origNode.additionalInfo,
            configuration: origNode.configuration,
            debugMode: origNode.debugMode,
            x: origNode.x,
            y: origNode.y,
            name: origNode.name,
            componentClazz: origNode.component.clazz,
        };
        if (origNode.targetRuleChainId) {
            node.targetRuleChainId = origNode.targetRuleChainId;
        }
        if (origNode.error) {
            node.error = origNode.error;
        }
        ruleNodes.nodes.push(node);
        if (i==0) {
            top = node.y;
            left = node.x;
            bottom = node.y + 50;
            right = node.x + 170;
        } else {
            top = Math.min(top, node.y);
            left = Math.min(left, node.x);
            bottom = Math.max(bottom, node.y + 50);
            right = Math.max(right, node.x + 170);
        }
    }
    ruleNodes.originX = left + (right-left)/2;
    ruleNodes.originY = top + (bottom-top)/2;
    for (i=0;i<connections.length;i++) {
        var connection: any = connections[i];
        ruleNodes.connections.push(connection);
    }
    this.bufferStore.set(this.RULE_NODES, JSON.stringify(ruleNodes));
  }

  hasRuleNodes(...rest: any[]): any {
    return this.bufferStore.get(this.RULE_NODES);
  }

  pasteRuleNodes(x?: any, y?: any, ...rest: any[]): any {
    var ruleNodesJson: any = this.bufferStore.get(this.RULE_NODES);
    if (ruleNodesJson) {
        var ruleNodes: any = JSON.parse(ruleNodesJson);
        var deltaX: any = x - ruleNodes.originX;
        var deltaY: any = y - ruleNodes.originY;
        for (var i: any=0;i<ruleNodes.nodes.length;i++) {
            var node: any = ruleNodes.nodes[i];
            var component: any = this.ruleChainService.getRuleNodeComponentByClazz(node.componentClazz);
            if (component) {
                var icon: any = types.ruleNodeType[component.type].icon;
                var iconUrl: any = null;
                if (component.configurationDescriptor.nodeDefinition.icon) {
                    icon = component.configurationDescriptor.nodeDefinition.icon;
                }
                if (component.configurationDescriptor.nodeDefinition.iconUrl) {
                    iconUrl = component.configurationDescriptor.nodeDefinition.iconUrl;
                }
                delete node.componentClazz;
                node.component = component;
                node.nodeClass = types.ruleNodeType[component.type].nodeClass;
                node.icon = icon;
                node.iconUrl = iconUrl;
                node.connectors = [];
                node.x = Math.round(node.x + deltaX);
                node.y = Math.round(node.y + deltaY);
            } else {
                return null;
            }
        }
        return ruleNodes;
    }
    return null;
  }

  copyWidget(dashboard?: any, sourceState?: any, sourceLayout?: any, widget?: any, ...rest: any[]): any {
    var widgetItem: any = this.prepareWidgetItem(dashboard, sourceState, sourceLayout, widget);
    this.bufferStore.set(this.WIDGET_ITEM, JSON.stringify(widgetItem));
  }

  copyWidgetReference(dashboard?: any, sourceState?: any, sourceLayout?: any, widget?: any, ...rest: any[]): any {
    var widgetReference: any = this.prepareWidgetReference(dashboard, sourceState, sourceLayout, widget);
    this.bufferStore.set(this.WIDGET_REFERENCE, JSON.stringify(widgetReference));
  }

  hasWidget(...rest: any[]): any {
    return this.bufferStore.get(this.WIDGET_ITEM);
  }

  canPasteWidgetReference(dashboard?: any, state?: any, layout?: any, ...rest: any[]): any {
    var widgetReferenceJson: any = this.bufferStore.get(this.WIDGET_REFERENCE);
    if (widgetReferenceJson) {
        var widgetReference: any = JSON.parse(widgetReferenceJson);
        if (widgetReference.dashboardId === dashboard.id.id) {
            if ((widgetReference.sourceState != state || widgetReference.sourceLayout != layout)
                && dashboard.configuration.widgets[widgetReference.widgetId]) {
                return true;
            }
        }
    }
    return false;
  }

  pasteWidgetReference(targetDashboard?: any, targetState?: any, targetLayout?: any, position?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var widgetReferenceJson: any = this.bufferStore.get(this.WIDGET_REFERENCE);
    if (widgetReferenceJson) {
        var widgetReference: any = JSON.parse(widgetReferenceJson);
        var widget: any = targetDashboard.configuration.widgets[widgetReference.widgetId];
        if (widget) {
            var originalColumns: any = widgetReference.originalColumns;
            var originalSize: any = widgetReference.originalSize;
            var targetRow: any = -1;
            var targetColumn: any = -1;
            if (position) {
                targetRow = position.row;
                targetColumn = position.column;
            }
            this.addWidgetToDashboard(targetDashboard, targetState, targetLayout, widget, null,
                null, originalColumns, originalSize, targetRow, targetColumn).then(
                function () {
                    deferred.resolve(widget);
                }
            );
        } else {
            deferred.reject();
        }
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  pasteWidget(targetDashboard?: any, targetState?: any, targetLayout?: any, position?: any, onAliasesUpdateFunction?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var widgetItemJson: any = this.bufferStore.get(this.WIDGET_ITEM);
    if (widgetItemJson) {
        var widgetItem: any = JSON.parse(widgetItemJson);
        var widget: any = widgetItem.widget;
        var aliasesInfo: any = widgetItem.aliasesInfo;
        var originalColumns: any = widgetItem.originalColumns;
        var originalSize: any = widgetItem.originalSize;
        var targetRow: any = -1;
        var targetColumn: any = -1;
        if (position) {
            targetRow = position.row;
            targetColumn = position.column;
        }
        widget.id = this.utils.guid();
        this.addWidgetToDashboard(targetDashboard, targetState, targetLayout, widget, aliasesInfo,
            onAliasesUpdateFunction, originalColumns, originalSize, targetRow, targetColumn).then(
                function () {
                    deferred.resolve(widget);
                }
        );
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  addWidgetToDashboard(dashboard?: any, targetState?: any, targetLayout?: any, widget?: any, aliasesInfo?: any, onAliasesUpdateFunction?: any, originalColumns?: any, originalSize?: any, row?: any, column?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var theDashboard: any;
    if (dashboard) {
        theDashboard = dashboard;
    } else {
        theDashboard = {};
    }

    theDashboard = this.dashboardUtils.validateAndUpdateDashboard(theDashboard);

    var callAliasUpdateFunction: any = false;
    if (aliasesInfo) {
        var newEntityAliases: any = this.updateAliases(theDashboard, widget, aliasesInfo);
        var aliasesUpdated: any = !angular.equals(newEntityAliases, theDashboard.configuration.entityAliases);
        if (aliasesUpdated) {
            theDashboard.configuration.entityAliases = newEntityAliases;
            if (onAliasesUpdateFunction) {
                callAliasUpdateFunction = true;
            }
        }
    }
    this.dashboardUtils.addWidgetToLayout(theDashboard, targetState, targetLayout, widget, originalColumns, originalSize, row, column);
    if (callAliasUpdateFunction) {
        onAliasesUpdateFunction();
    }
    deferred.resolve(theDashboard);
    return deferred.promise;
  }

  updateAliases(dashboard?: any, widget?: any, aliasesInfo?: any, ...rest: any[]): any {
    var entityAliases: any = structuredClone(dashboard.configuration.entityAliases);
    var aliasInfo: any;
    var newAliasId: any;
    for (var datasourceIndex in aliasesInfo.datasourceAliases) {
        aliasInfo = aliasesInfo.datasourceAliases[datasourceIndex];
        newAliasId = this.getEntityAliasId(entityAliases, aliasInfo);
        widget.config.datasources[datasourceIndex].entityAliasId = newAliasId;
    }
    for (var targetDeviceAliasIndex in aliasesInfo.targetDeviceAliases) {
        aliasInfo = aliasesInfo.targetDeviceAliases[targetDeviceAliasIndex];
        newAliasId = this.getEntityAliasId(entityAliases, aliasInfo);
        widget.config.targetDeviceAliasIds[targetDeviceAliasIndex] = newAliasId;
    }
    return entityAliases;
  }

  isEntityAliasEqual(alias1?: any, alias2?: any, ...rest: any[]): any {
    return angular.equals(alias1.filter, alias2.filter);
  }

  getEntityAliasId(entityAliases?: any, aliasInfo?: any, ...rest: any[]): any {
    var newAliasId: any;
    for (var aliasId in entityAliases) {
        if (this.isEntityAliasEqual(entityAliases[aliasId], aliasInfo)) {
            newAliasId = aliasId;
            break;
        }
    }
    if (!newAliasId) {
        var newAliasName: any = this.createEntityAliasName(entityAliases, aliasInfo.alias);
        newAliasId = this.utils.guid();
        entityAliases[newAliasId] = {id: newAliasId, alias: newAliasName, filter: aliasInfo.filter};
    }
    return newAliasId;
  }

  createEntityAliasName(entityAliases?: any, alias?: any, ...rest: any[]): any {
    var c: any = 0;
    var newAlias: any = structuredClone(alias);
    var unique: any = false;
    while (!unique) {
        unique = true;
        for (var entAliasId in entityAliases) {
            var entAlias: any = entityAliases[entAliasId];
            if (newAlias === entAlias.alias) {
                c++;
                newAlias = alias + c;
                unique = false;
            }
        }
    }
    return newAlias;
  }
}
