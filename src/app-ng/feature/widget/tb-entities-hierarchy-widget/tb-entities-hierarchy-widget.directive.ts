import { Component, forwardRef, model, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TbNavTreeDirective } from '../../components/tb-nav-tree/tb-nav-tree.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import $ from 'jquery';
import { isEqual } from 'lodash-es';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;
declare let entitiesHierarchyDataUpdatedService: any;

// Type-only augmentation exposing the legacy vm properties/methods the template binds to.
export interface TbEntitiesHierarchyWidgetDirective {
    showData: any;
    query: any;
    loadNodes: any;
    nodeEditCallbacks: any;
    exitFilterMode: (...args: any[]) => any;
    onNodeSelected: (...args: any[]) => any;
    onNodesInserted: (...args: any[]) => any;
    searchCallback: (...args: any[]) => any;
    node: any;
    event: any;
    nodes: any;
    parent: any;
    searchText: any;
}

// Helpers at the legacy file's top level, beside the registration (as written).
function EntitiesHierarchyWidgetController(this: any, $element?: any, $scope?: any, $q?: any, $timeout?: any, toast?: any, types?: any, entityService?: any, entityRelationService?: any /*$filter, $mdMedia, $mdPanel, $document, $translate, $timeout, utils, types*/) {
    var vm: any = this;

    vm.showData = true;

    vm.nodeEditCallbacks = {};

    vm.nodeIdCounter = 0;

    vm.nodesMap = {};
    vm.pendingUpdateNodeTasks = {};

    vm.query = {
        search: null
    };

    vm.searchAction = {
        name: 'action.search',
        show: true,
        onAction: function() {
            vm.enterFilterMode();
        },
        icon: 'search'
    };

    vm.onNodesInserted = onNodesInserted;
    vm.onNodeSelected = onNodeSelected;
    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.searchCallback = searchCallback;

    $scope.$watch('vm.ctx', function() {
        if (vm.ctx && vm.ctx.defaultSubscription) {
            vm.settings = vm.ctx.settings;
            vm.widgetConfig = vm.ctx.widgetConfig;
            vm.subscription = vm.ctx.defaultSubscription;
            vm.datasources = vm.subscription.datasources;
            initializeConfig();
            updateDatasources();
        }
    });

    const searchEffect = effect(() => {
        const newVal = vm.query.search;
        if (vm.query.search != null) {
            updateSearchNodes();
        }
    });

    entitiesHierarchyDataUpdatedService.subject.subscribe((hierarchyId?: any) => {
        if (vm.hierarchyId == hierarchyId) {
            if (vm.subscription) {
                updateNodeData(vm.subscription.data);
            }
        }
    });

    function initializeConfig() {

        vm.ctx.widgetActions = [ vm.searchAction ];

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

        var nodeRelationQueryFunction: any = loadNodeCtxFunction(vm.settings.nodeRelationQueryFunction, 'nodeCtx', testNodeCtx);
        var nodeIconFunction: any = loadNodeCtxFunction(vm.settings.nodeIconFunction, 'nodeCtx', testNodeCtx);
        var nodeTextFunction: any = loadNodeCtxFunction(vm.settings.nodeTextFunction, 'nodeCtx', testNodeCtx);
        var nodeDisabledFunction: any = loadNodeCtxFunction(vm.settings.nodeDisabledFunction, 'nodeCtx', testNodeCtx);
        var nodeOpenedFunction: any = loadNodeCtxFunction(vm.settings.nodeOpenedFunction, 'nodeCtx', testNodeCtx);
        var nodeHasChildrenFunction: any = loadNodeCtxFunction(vm.settings.nodeHasChildrenFunction, 'nodeCtx', testNodeCtx);

        var testNodeCtx2: any = structuredClone(testNodeCtx);
        testNodeCtx2.entity.name = 'TEST DEV2';
        testNodeCtx2.entity.name = 'TEST DEV2';

        var nodesSortFunction: any = loadNodeCtxFunction(vm.settings.nodesSortFunction, 'nodeCtx1,nodeCtx2', testNodeCtx, testNodeCtx2);

        vm.nodeRelationQueryFunction = nodeRelationQueryFunction || defaultNodeRelationQueryFunction;
        vm.nodeIconFunction = nodeIconFunction || defaultNodeIconFunction;
        vm.nodeTextFunction = nodeTextFunction || ((nodeCtx?: any) => nodeCtx.entity.name);
        vm.nodeDisabledFunction = nodeDisabledFunction || (() => false);
        vm.nodeOpenedFunction = nodeOpenedFunction || defaultNodeOpenedFunction;
        vm.nodeHasChildrenFunction = nodeHasChildrenFunction || (() => true);
        vm.nodesSortFunction = nodesSortFunction || defaultSortFunction;
    }

    function loadNodeCtxFunction(functionBody?: any, argNames?: any, ...args: any[]) {
        var nodeCtxFunction: any = null;
    function loadNodeCtxFunction(functionBody?: any, argNames?: any, ...args: any[]) {
        var nodeCtxFunction: any = null;
        if (functionBody !== undefined && functionBody.length) {
            try {
                nodeCtxFunction = new Function(argNames, functionBody);
                var res: any = nodeCtxFunction.apply(null, args);
                if (res === undefined) {
                    nodeCtxFunction = null;
                }
            } catch (e) {
                nodeCtxFunction = null;
            }
        }
        return nodeCtxFunction;
    }
        return nodeCtxFunction;
    }

    function enterFilterMode () {
        vm.query.search = '';
        vm.ctx.hideTitlePanel = true;
        $timeout(()=>{
            $(vm.ctx.$container).find('.searchInput').focus();
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        updateSearchNodes();
        vm.ctx.hideTitlePanel = false;
    }

    function searchCallback (searchText?: any, node?: any) {
        var theNode: any = vm.nodesMap[node.id];
        if (theNode && theNode.data.searchText) {
            return theNode.data.searchText.includes(searchText.toLowerCase());
        }
        return false;
    }

    function updateDatasources() {
        vm.loadNodes = loadNodes;
    }

    function updateSearchNodes() {
        if (vm.query.search != null) {
            vm.nodeEditCallbacks.search(vm.query.search);
        } else {
            vm.nodeEditCallbacks.clearSearch();
        }
    }

    function onNodesInserted(nodes?: any/*, parent*/) {
        if (nodes) {
            nodes.forEach((nodeId?: any) => {
                var task: any = vm.pendingUpdateNodeTasks[nodeId];
                if (task) {
                    task();
                    delete vm.pendingUpdateNodeTasks[nodeId];
                }
            });
        }
    }

    function onNodeSelected(node?: any, event?: any) {
        var nodeId: any;
        if (!node) {
            nodeId = -1;
        } else {
            nodeId = node.id;
        }
        if (nodeId !== -1) {
            var selectedNode: any = vm.nodesMap[nodeId];
            if (selectedNode) {
                var descriptors: any = vm.ctx.actionsApi.getActionDescriptors('nodeSelected');
                if (descriptors.length) {
                    var entity: any = selectedNode.data.nodeCtx.entity;
                    vm.ctx.actionsApi.handleWidgetAction(event, descriptors[0], entity.id, entity.name, { nodeCtx: selectedNode.data.nodeCtx });
                }
            }
        }
    }

    function updateNodeData(subscriptionData?: any) {
        var affectedNodes: any = [];
        if (subscriptionData) {
            for (var i: any=0;i<subscriptionData.length;i++) {
                var datasource: any = subscriptionData[i].datasource;
                if (datasource.nodeId) {
                    var node: any = vm.nodesMap[datasource.nodeId];
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
            var node: any = vm.nodeEditCallbacks.getNode(nodeId);
            if (node) {
                updateNodeStyle(vm.nodesMap[nodeId]);
            } else {
                vm.pendingUpdateNodeTasks[nodeId] = () => {
                    updateNodeStyle(vm.nodesMap[nodeId]);
                };
            }
        });
    }

    function updateNodeStyle(node?: any) {
        var newText: any = prepareNodeText(node);
        if (!isEqual(node.text, newText)) {
            node.text = newText;
            vm.nodeEditCallbacks.updateNode(node.id, node.text);
        }
        var newDisabled: any = vm.nodeDisabledFunction(node.data.nodeCtx);
        if (!isEqual(node.state.disabled, newDisabled)) {
            node.state.disabled = newDisabled;
            if (node.state.disabled) {
                vm.nodeEditCallbacks.disableNode(node.id);
            } else {
                vm.nodeEditCallbacks.enableNode(node.id);
            }
        }
        var newHasChildren: any = vm.nodeHasChildrenFunction(node.data.nodeCtx);
        if (!isEqual(node.children, newHasChildren)) {
            node.children = newHasChildren;
            vm.nodeEditCallbacks.setNodeHasChildren(node.id, node.children);
        }
    }

    function prepareNodeText(node?: any) {
        var nodeIcon: any = prepareNodeIcon(node.data.nodeCtx);
        var nodeText: any = vm.nodeTextFunction(node.data.nodeCtx);
        node.data.searchText = nodeText ? nodeText.replace(/<[^>]+>/g, '').toLowerCase() : "";
        return nodeIcon + nodeText;
    }

    function loadNodes(node?: any, cb?: any) {
        if (node.id === '#') {
            var tasks: any = [];
            for (var i: any=0;i<vm.datasources.length;i++) {
                var datasource: any = vm.datasources[i];
                tasks.push(datasourceToNode(datasource));
            }
            $q.all(tasks).then((nodes?: any) => {
                cb(prepareNodes(nodes));
                updateNodeData(vm.subscription.data);
            });
        } else {
            if (node.data && node.data.nodeCtx.entity && node.data.nodeCtx.entity.id && node.data.nodeCtx.entity.id.entityType !== 'function') {
                var relationQuery: any = prepareNodeRelationQuery(node.data.nodeCtx);
                entityRelationService.findByQuery(relationQuery, {ignoreErrors: true, ignoreLoading: true}).then(
                    (entityRelations?: any) => {
                        var tasks: any = [];
                        for (var i: any=0;i<entityRelations.length;i++) {
                            var relation: any = entityRelations[i];
                            var targetId: any = relationQuery.parameters.direction === types.entitySearchDirection.from ? relation.to : relation.from;
                            tasks.push(entityIdToNode(targetId.entityType, targetId.id, node.data.datasource, node.data.nodeCtx));
                        }
                        $q.all(tasks).then((nodes?: any) => {
                            cb(prepareNodes(nodes));
                        });
                    },
                    (error?: any) => {
                        var errorText: any = "Failed to get relations!";
                        if (error && error.status === 400) {
                            errorText = "Invalid relations query returned by 'Node relations query function'! Please check widget configuration!";
                        }
                        showError(errorText);
                    }
                );
            } else {
                cb([]);
            }
        }
    }

    function showError(errorText?: any) {
        var toastParent: any = $('.tb-entities-hierarchy', $element);
        toast.showError(errorText, toastParent, 'bottom left');
    }

    function prepareNodes(nodes?: any) {
        nodes = nodes.filter((node?: any) => node !== null);
        nodes.sort((node1?: any, node2?: any) => vm.nodesSortFunction(node1.data.nodeCtx, node2.data.nodeCtx));
        return nodes;
    }

    function datasourceToNode(datasource?: any, parentNodeCtx?: any) {
        var deferred: any = $q.defer();
        resolveEntity(datasource).then(
            (entity?: any) => {
                if (entity != null) {
                    var node: any = {
                        id: ++vm.nodeIdCounter
                    };
                    vm.nodesMap[node.id] = node;
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
                        disabled: vm.nodeDisabledFunction(node.data.nodeCtx),
                        opened: vm.nodeOpenedFunction(node.data.nodeCtx)
                    };
                    node.text = prepareNodeText(node);
                    node.children = vm.nodeHasChildrenFunction(node.data.nodeCtx);
                    deferred.resolve(node);
                } else {
                    deferred.resolve(null);
                }
            }
        );
        return deferred.promise;
    }

    function entityIdToNode(entityType?: any, entityId?: any, parentDatasource?: any, parentNodeCtx?: any) {
        var deferred: any = $q.defer();
        var datasource: any = {
            dataKeys: parentDatasource.dataKeys,
            type: types.datasourceType.entity,
            entityType: entityType,
            entityId: entityId
        };
        datasourceToNode(datasource, parentNodeCtx).then(
            (node?: any) => {
                if (node != null) {
                    var subscriptionOptions: any = {
                        type: types.widgetType.latest.value,
                        datasources: [datasource],
                        callbacks: {
                            onDataUpdated: (subscription?: any) => {
                                updateNodeData(subscription.data);
                            }
                        }
                    };
                    vm.ctx.subscriptionApi.createSubscription(subscriptionOptions, true).then(
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

    function resolveEntity(datasource?: any) {
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
            entityService.getEntity(datasource.entityType, datasource.entityId, {ignoreLoading: true}).then(
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


    function prepareNodeRelationQuery(nodeCtx?: any) {
        var relationQuery: any = vm.nodeRelationQueryFunction(nodeCtx);
        if (relationQuery && relationQuery === 'default') {
            relationQuery = defaultNodeRelationQueryFunction(nodeCtx);
        }
        return relationQuery;
    }

    function defaultNodeRelationQueryFunction(nodeCtx?: any) {
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
    }

    function prepareNodeIcon(nodeCtx?: any) {
        var iconInfo: any = vm.nodeIconFunction(nodeCtx);
        if (iconInfo && iconInfo === 'default') {
            iconInfo = defaultNodeIconFunction(nodeCtx);
        }
        if (iconInfo && (iconInfo.iconUrl || iconInfo.materialIcon)) {
            if (iconInfo.materialIcon) {
                return materialIconHtml(iconInfo.materialIcon);
            } else {
                return iconUrlHtml(iconInfo.iconUrl);
            }
        } else {
            return "";
        }
        return undefined;
    }

    function materialIconHtml(materialIcon?: any) {
        return '<md-icon aria-label="'+materialIcon+'" class="node-icon material-icons" role="img" aria-hidden="false">'+materialIcon+'</md-icon>';
    }

    function iconUrlHtml(iconUrl?: any) {
        return '<div class="node-icon" style="background-image: url('+iconUrl+');">&nbsp;</div>';
    }

    function defaultNodeIconFunction(nodeCtx?: any) {
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
    }

    function defaultNodeOpenedFunction(nodeCtx?: any) {
        return nodeCtx.level <= 4;
    }

    function defaultSortFunction(nodeCtx1?: any, nodeCtx2?: any) {
        var result: any = nodeCtx1.entity.id.entityType.localeCompare(nodeCtx2.entity.id.entityType);
        if (result === 0) {
            result = nodeCtx1.entity.name.localeCompare(nodeCtx2.entity.name);
        }
        return result;
    }
}

/**
 * Ported from the AngularJS directive `tbEntitiesHierarchyWidget` (module `thingsboard.widgets.entitiesHierarchyWidget`) in src/app/widget/lib/entities-hierarchy-widget.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
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

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            hierarchyId: '=',
            ctx: '='
        };
  controller: any = EntitiesHierarchyWidgetController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
