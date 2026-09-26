import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityRelationService } from '../../api/services/entity-relation.service';
import { EntityService } from '../../api/services/entity.service';
import { ToastService } from '../../services/toast.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbNavTreeDirective } from '../../components/tb-nav-tree/tb-nav-tree.directive';

import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { $q, $timeout } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $scope: any;
declare let toast: any;
declare let entityService: any;
declare let entityRelationService: any;

/**
 * Ported from the AngularJS directive `tbEntitiesHierarchyWidget` (module `thingsboard.widgets.entitiesHierarchyWidget`) in src/app/widget/lib/entities-hierarchy-widget.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entities-hierarchy-widget',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, forwardRef(() => TbNavTreeDirective)],
  templateUrl: './tb-entities-hierarchy-widget.directive.html',
})
export class TbEntitiesHierarchyWidgetDirective {
  readonly hierarchyId = model<any>();
  readonly ctx = model<any>();

  protected readonly element = inject(ElementRef);
  // TODO(port): '$scope' — component state: fields and signals on this class
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  protected readonly toast = inject(ToastService);
  protected readonly entityService = inject(EntityService);
  protected readonly entityRelationService = inject(EntityRelationService);

  showData: any = true;
  nodeEditCallbacks: any = {};
  nodeIdCounter: any = 0;
  nodesMap: any = {};
  pendingUpdateNodeTasks: any = {};
  query: any = {
        search: null
    };
  searchAction: any;
  datasources: any;
  nodeDisabledFunction: any;
  nodeHasChildrenFunction: any;
  nodeIconFunction: any;
  nodeOpenedFunction: any;
  nodeRelationQueryFunction: any;
  nodeTextFunction: any;
  nodesSortFunction: any;
  settings: any;
  subscription: any;
  widgetConfig: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    let vm = this;
    this.searchAction = {
        name: 'action.search',
        show: true,
        onAction: (...rest: any[]) => {
            this.enterFilterMode();
        },
        icon: 'search'
    };
    this.onNodesInserted = this.onNodesInserted;
    this.onNodeSelected = this.onNodeSelected;
    this.enterFilterMode = this.enterFilterMode;
    this.exitFilterMode = this.exitFilterMode;
    this.searchCallback = this.searchCallback;
    $scope.$watch('vm.ctx', () => {
        if (this.ctx() && this.ctx().defaultSubscription) {
            this.settings = this.ctx().settings;
            this.widgetConfig = this.ctx().widgetConfig;
            this.subscription = this.ctx().defaultSubscription;
            this.datasources = this.subscription.datasources;
            this.initializeConfig();
            this.updateDatasources();
        }
    });
    $scope.$watch("vm.query.search", (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal) && this.query.search != null) {
            this.updateSearchNodes();
        }
    });
    $scope.$on('entities-hierarchy-data-updated', (event?: any, hierarchyId?: any) => {
        if (this.hierarchyId() == hierarchyId) {
            if (this.subscription) {
                this.updateNodeData(this.subscription.data);
            }
        }
    });
  }

  initializeConfig(...rest: any[]): any {

    this.ctx().widgetActions = [ this.searchAction ];

    var testNodeCtx: any = {
        entity: {
            id: {
                entityType: 'DEVICE',
                id: '123'
            },
            name: 'TEST DEV1'
        },
        data: {},
        level: 2
    };
    var parentNodeCtx: any = structuredClone(testNodeCtx);
    parentNodeCtx.level = 1;
    testNodeCtx.parentNodeCtx = parentNodeCtx;

    var nodeRelationQueryFunction: any = this.loadNodeCtxFunction(this.settings.nodeRelationQueryFunction, 'nodeCtx', testNodeCtx);
    var nodeIconFunction: any = this.loadNodeCtxFunction(this.settings.nodeIconFunction, 'nodeCtx', testNodeCtx);
    var nodeTextFunction: any = this.loadNodeCtxFunction(this.settings.nodeTextFunction, 'nodeCtx', testNodeCtx);
    var nodeDisabledFunction: any = this.loadNodeCtxFunction(this.settings.nodeDisabledFunction, 'nodeCtx', testNodeCtx);
    var nodeOpenedFunction: any = this.loadNodeCtxFunction(this.settings.nodeOpenedFunction, 'nodeCtx', testNodeCtx);
    var nodeHasChildrenFunction: any = this.loadNodeCtxFunction(this.settings.nodeHasChildrenFunction, 'nodeCtx', testNodeCtx);

    var testNodeCtx2: any = structuredClone(testNodeCtx);
    testNodeCtx2.entity.name = 'TEST DEV2';

    var nodesSortFunction: any = this.loadNodeCtxFunction(this.settings.nodesSortFunction, 'nodeCtx1,nodeCtx2', testNodeCtx, testNodeCtx2);

    this.nodeRelationQueryFunction = nodeRelationQueryFunction || this.defaultNodeRelationQueryFunction;
    this.nodeIconFunction = nodeIconFunction || this.defaultNodeIconFunction;
    this.nodeTextFunction = nodeTextFunction || ((nodeCtx?: any) => nodeCtx.entity.name);
    this.nodeDisabledFunction = nodeDisabledFunction || (() => false);
    this.nodeOpenedFunction = nodeOpenedFunction || this.defaultNodeOpenedFunction;
    this.nodeHasChildrenFunction = nodeHasChildrenFunction || (() => true);
    this.nodesSortFunction = nodesSortFunction || this.defaultSortFunction;
  }

  loadNodeCtxFunction(functionBody?: any, argNames?: any, ...args: any[]): any {
    var nodeCtxFunction: any = null;
    if ((functionBody !== undefined) && functionBody.length) {
        try {
            nodeCtxFunction = new Function(argNames, functionBody);
            var res: any = nodeCtxFunction.apply(null, args);
            if ((res === undefined)) {
                nodeCtxFunction = null;
            }
        } catch (e: any) {
            nodeCtxFunction = null;
        }
    }
    return nodeCtxFunction;
  }

  enterFilterMode = (...rest: any[]): any => {
    this.query.search = '';
    this.ctx().hideTitlePanel = true;
    setTimeout(()=>{
        $(this.ctx().$container).find('.searchInput').focus();
    })
  };

  exitFilterMode = (...rest: any[]): any => {
    this.query.search = null;
    this.updateSearchNodes();
    this.ctx().hideTitlePanel = false;
  };

  searchCallback = (searchText?: any, node?: any, ...rest: any[]): any => {
    var theNode: any = this.nodesMap[node.id];
    if (theNode && theNode.data.searchText) {
        return theNode.data.searchText.includes(searchText.toLowerCase());
    }
    return false;
  };

  updateDatasources(...rest: any[]): any {
    this.loadNodes = this.loadNodes;
  }

  updateSearchNodes(...rest: any[]): any {
    if (this.query.search != null) {
        this.nodeEditCallbacks.search(this.query.search);
    } else {
        this.nodeEditCallbacks.clearSearch();
    }
  }

  onNodesInserted = (nodes?: any, /*, parent*/: any, ...rest: any[]): any => {
    if (nodes) {
        nodes.forEach((nodeId?: any) => {
            var task: any = this.pendingUpdateNodeTasks[nodeId];
            if (task) {
                task();
                delete this.pendingUpdateNodeTasks[nodeId];
            }
        });
    }
  };

  onNodeSelected = (node?: any, event?: any, ...rest: any[]): any => {
    var nodeId: any;
    if (!node) {
        nodeId = -1;
    } else {
        nodeId = node.id;
    }
    if (nodeId !== -1) {
        var selectedNode: any = this.nodesMap[nodeId];
        if (selectedNode) {
            var descriptors: any = this.ctx().actionsApi.getActionDescriptors('nodeSelected');
            if (descriptors.length) {
                var entity: any = selectedNode.data.nodeCtx.entity;
                this.ctx().actionsApi.handleWidgetAction(event, descriptors[0], entity.id, entity.name, { nodeCtx: selectedNode.data.nodeCtx });
            }
        }
    }
  };

  updateNodeData(subscriptionData?: any, ...rest: any[]): any {
    var affectedNodes: any = [];
    if (subscriptionData) {
        for (var i: any=0;i<subscriptionData.length;i++) {
            var datasource: any = subscriptionData[i].datasource;
            if (datasource.nodeId) {
                var node: any = this.nodesMap[datasource.nodeId];
                var key: any = subscriptionData[i].dataKey.label;
                var value: any = undefined;
                if (subscriptionData[i].data && subscriptionData[i].data.length) {
                    value = subscriptionData[i].data[0][1];
                }
                if (node.data.nodeCtx.data[key] !== value) {
                    if (affectedNodes.indexOf(datasource.nodeId) === -1) {
                        affectedNodes.push(datasource.nodeId);
                    }
                    node.data.nodeCtx.data[key] = value;
                }
            }
        }
    }
    affectedNodes.forEach((nodeId?: any) => {
        var node: any = this.nodeEditCallbacks.getNode(nodeId);
        if (node) {
            this.updateNodeStyle(this.nodesMap[nodeId]);
        } else {
            this.pendingUpdateNodeTasks[nodeId] = () => {
                this.updateNodeStyle(this.nodesMap[nodeId]);
            };
        }
    });
  }

  updateNodeStyle(node?: any, ...rest: any[]): any {
    var newText: any = this.prepareNodeText(node);
    if (!angular.equals(node.text, newText)) {
        node.text = newText;
        this.nodeEditCallbacks.updateNode(node.id, node.text);
    }
    var newDisabled: any = this.nodeDisabledFunction(node.data.nodeCtx);
    if (!angular.equals(node.state.disabled, newDisabled)) {
        node.state.disabled = newDisabled;
        if (node.state.disabled) {
            this.nodeEditCallbacks.disableNode(node.id);
        } else {
            this.nodeEditCallbacks.enableNode(node.id);
        }
    }
    var newHasChildren: any = this.nodeHasChildrenFunction(node.data.nodeCtx);
    if (!angular.equals(node.children, newHasChildren)) {
        node.children = newHasChildren;
        this.nodeEditCallbacks.setNodeHasChildren(node.id, node.children);
    }
  }

  prepareNodeText(node?: any, ...rest: any[]): any {
    var nodeIcon: any = this.prepareNodeIcon(node.data.nodeCtx);
    var nodeText: any = this.nodeTextFunction(node.data.nodeCtx);
    node.data.searchText = nodeText ? nodeText.replace(/<[^>]+>/g, '').toLowerCase() : "";
    return nodeIcon + nodeText;
  }

  loadNodes = (node?: any, cb?: any, ...rest: any[]): any => {
    if (node.id === '#') {
        var tasks: any = [];
        for (var i: any=0;i<this.datasources.length;i++) {
            var datasource: any = this.datasources[i];
            tasks.push(this.datasourceToNode(datasource));
        }
        Promise.all(tasks).then((nodes?: any) => {
            cb(this.prepareNodes(nodes));
            this.updateNodeData(this.subscription.data);
        });
    } else {
        if (node.data && node.data.nodeCtx.entity && node.data.nodeCtx.entity.id && node.data.nodeCtx.entity.id.entityType !== 'function') {
            var relationQuery: any = this.prepareNodeRelationQuery(node.data.nodeCtx);
            this.entityRelationService.findByQuery(relationQuery, {ignoreErrors: true, ignoreLoading: true}).then(
                (entityRelations?: any) => {
                    var tasks: any = [];
                    for (var i: any=0;i<entityRelations.length;i++) {
                        var relation: any = entityRelations[i];
                        var targetId: any = relationQuery.parameters.direction === types.entitySearchDirection.from ? relation.to : relation.from;
                        tasks.push(this.entityIdToNode(targetId.entityType, targetId.id, node.data.datasource, node.data.nodeCtx));
                    }
                    Promise.all(tasks).then((nodes?: any) => {
                        cb(this.prepareNodes(nodes));
                    });
                },
                (error?: any) => {
                    var errorText: any = "Failed to get relations!";
                    if (error && error.status === 400) {
                        errorText = "Invalid relations query returned by 'Node relations query function'! Please check widget configuration!";
                    }
                    this.showError(errorText);
                }
            );
        } else {
            cb([]);
        }
    }
  };

  showError(errorText?: any, ...rest: any[]): any {
    var toastParent: any = $('.tb-entities-hierarchy', $(this.element.nativeElement));
    this.toast.showError(errorText, toastParent, 'bottom left');
  }

  prepareNodes(nodes?: any, ...rest: any[]): any {
    nodes = nodes.filter((node?: any) => node !== null);
    nodes.sort((node1?: any, node2?: any) => this.nodesSortFunction(node1.data.nodeCtx, node2.data.nodeCtx));
    return nodes;
  }

  datasourceToNode(datasource?: any, parentNodeCtx?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.resolveEntity(datasource).then(
        (entity?: any) => {
            if (entity != null) {
                var node: any = {
                    id: ++this.nodeIdCounter
                };
                this.nodesMap[node.id] = node;
                datasource.nodeId = node.id;
                node.icon = false;
                var nodeCtx: any = {
                    parentNodeCtx: parentNodeCtx,
                    entity: entity,
                    data: {}
                };
                nodeCtx.level = parentNodeCtx ? parentNodeCtx.level + 1 : 1;
                node.data = {
                    datasource: datasource,
                    nodeCtx: nodeCtx
                };
                node.state = {
                    disabled: this.nodeDisabledFunction(node.data.nodeCtx),
                    opened: this.nodeOpenedFunction(node.data.nodeCtx)
                };
                node.text = this.prepareNodeText(node);
                node.children = this.nodeHasChildrenFunction(node.data.nodeCtx);
                deferred.resolve(node);
            } else {
                deferred.resolve(null);
            }
        }
    );
    return deferred.promise;
  }

  entityIdToNode(entityType?: any, entityId?: any, parentDatasource?: any, parentNodeCtx?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var datasource: any = {
        dataKeys: parentDatasource.dataKeys,
        type: types.datasourceType.entity,
        entityType: entityType,
        entityId: entityId
    };
    this.datasourceToNode(datasource, parentNodeCtx).then(
        (node?: any) => {
            if (node != null) {
                var subscriptionOptions: any = {
                    type: types.widgetType.latest.value,
                    datasources: [datasource],
                    callbacks: {
                        onDataUpdated: (subscription?: any, ...rest: any[]) => {
                            this.updateNodeData(subscription.data);
                        }
                    }
                };
                this.ctx().subscriptionApi.createSubscription(subscriptionOptions, true).then(
                    (/*subscription*/) => {
                        deferred.resolve(node);
                    }
                );
            } else {
                deferred.resolve(node);
            }
        }
    );
    return deferred.promise;
  }

  resolveEntity(datasource?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (datasource.type === types.datasourceType.function) {
        var entity: any = {
            id: {
                entityType: "function"
            },
            name: datasource.name
        }
        deferred.resolve(entity);
    } else {
        this.entityService.getEntity(datasource.entityType, datasource.entityId, {ignoreLoading: true}).then(
            (entity?: any) => {
                deferred.resolve(entity);
            },
            () => {
                deferred.resolve(null);
            }
        );
    }
    return deferred.promise;
  }

  prepareNodeRelationQuery(nodeCtx?: any, ...rest: any[]): any {
    var relationQuery: any = this.nodeRelationQueryFunction(nodeCtx);
    if (relationQuery && relationQuery === 'default') {
        relationQuery = this.defaultNodeRelationQueryFunction(nodeCtx);
    }
    return relationQuery;
  }

  defaultNodeRelationQueryFunction = (nodeCtx?: any, ...rest: any[]): any => {
    var entity: any = nodeCtx.entity;
    var query: any = {
        parameters: {
            rootId: entity.id.id,
            rootType: entity.id.entityType,
            direction: types.entitySearchDirection.from,
            relationTypeGroup: "COMMON",
            maxLevel: 1
        },
        filters: [
            {
                relationType: "Contains",
                entityTypes: []
            }
        ]
    };
    return query;
  };

  prepareNodeIcon(nodeCtx?: any, ...rest: any[]): any {
    var iconInfo: any = this.nodeIconFunction(nodeCtx);
    if (iconInfo && iconInfo === 'default') {
        iconInfo = this.defaultNodeIconFunction(nodeCtx);
    }
    if (iconInfo && (iconInfo.iconUrl || iconInfo.materialIcon)) {
        if (iconInfo.materialIcon) {
            return this.materialIconHtml(iconInfo.materialIcon);
        } else {
            return this.iconUrlHtml(iconInfo.iconUrl);
        }
    } else {
        return "";
    }
  }

  materialIconHtml(materialIcon?: any, ...rest: any[]): any {
    return '<md-icon aria-label="'+materialIcon+'" class="node-icon material-icons" role="img" aria-hidden="false">'+materialIcon+'</md-icon>';
  }

  iconUrlHtml(iconUrl?: any, ...rest: any[]): any {
    return '<div class="node-icon" style="background-image: url('+iconUrl+');">&nbsp;</div>';
  }

  defaultNodeIconFunction = (nodeCtx?: any, ...rest: any[]): any => {
    var materialIcon: any = 'insert_drive_file';
    var entity: any = nodeCtx.entity;
    if (entity && entity.id && entity.id.entityType) {
        switch (entity.id.entityType) {
            case 'function':
                materialIcon = 'functions';
                break;
            case types.entityType.device:
                materialIcon = 'devices_other';
                break;
            case types.entityType.asset:
                materialIcon = 'domain';
                break;
            case types.entityType.tenant:
                materialIcon = 'supervisor_account';
                break;
            case types.entityType.customer:
                materialIcon = 'supervisor_account';
                break;
            case types.entityType.user:
                materialIcon = 'account_circle';
                break;
            case types.entityType.dashboard:
                materialIcon = 'dashboards';
                break;
            case types.entityType.alarm:
                materialIcon = 'notifications_active';
                break;
            case types.entityType.entityView:
                materialIcon = 'view_quilt';
                break;
        }
    }
    return {
        materialIcon: materialIcon
    };
  };

  defaultNodeOpenedFunction = (nodeCtx?: any, ...rest: any[]): any => {
    return nodeCtx.level <= 4;
  };

  defaultSortFunction = (nodeCtx1?: any, nodeCtx2?: any, ...rest: any[]): any => {
    var result: any = nodeCtx1.entity.id.entityType.localeCompare(nodeCtx2.entity.id.entityType);
    if (result === 0) {
        result = nodeCtx1.entity.name.localeCompare(nodeCtx2.entity.name);
    }
    return result;
  };
}
