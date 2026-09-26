import { Component, forwardRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ItembufferService } from '../../services/itembuffer.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { TranslateService } from '@ngx-translate/core';
import { helpLinks } from '../../help/constants/help-links';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbExpandFullscreenDirective } from '../../components/tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';
import { TbDetailsSidenavDirective } from '../../components/tb-details-sidenav/tb-details-sidenav.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbRuleNodeDirective } from '../tb-rule-node/tb-rule-node.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRuleNodeLinkDirective } from '../tb-rule-node-link/tb-rule-node-link.directive';

import $ from 'jquery';
import addRuleNodeTemplate from '../../../../app/rulechain/add-rulenode.tpl.html';
import addRuleNodeLinkTemplate from '../../../../app/rulechain/add-link.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { KeyboardShortcutPipe } from '../../components/pipes/keyboard-shortcut.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let componentType: any;
declare let $compile: any;
declare let $filter: any;
declare let $mdExpansionPanel: any;
declare let $mdUtil: any;
declare let $q: any;
declare let $scope: any;
declare let $window: any;
declare let Modelfactory: any;
declare let flowchartConstants: any;
declare let hotkeys: any;
declare let ruleChain: any;
declare let ruleChainMetaData: any;
declare let ruleNodeComponents: any;

/**
 * Ported from the AngularJS controller `RuleChainController` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 7 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'rule-chain',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatTabsModule, MatMenuModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, KeyboardShortcutPipe, FormsModule, forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbConfirmOnExitDirective), forwardRef(() => TbDetailsSidenavDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbRuleNodeDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRuleNodeLinkDirective)],
  templateUrl: './rule-chain.component.html',
})
export class RuleChainComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly router = inject(Router);
  // TODO(port): '$scope' — component state: fields and signals on this class
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  // TODO(port): '$mdExpansionPanel' — a mat-expansion-panel, reached with viewChild
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly translate = inject(TranslateService);
  // TODO(port): 'hotkeys' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  protected readonly typesRef: any = types;
  protected readonly ruleChainService = inject(RuleChainService);
  protected readonly itembuffer = inject(ItembufferService);
  // TODO(port): 'Modelfactory' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): 'flowchartConstants' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): 'ruleChain' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): 'ruleChainMetaData' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): 'ruleNodeComponents' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): elements not resolved to a component: md-sidenav, md-expansion-panel-group, md-expansion-panel, md-expansion-panel-collapsed, md-expansion-panel-icon, md-expansion-panel-expanded, md-expansion-panel-header, md-expansion-panel-content, fc-canvas, details-buttons
  // TODO(port): template: 1 × md-expansion-panel left in place
  // TODO(port): template: 1 × md-expansion-panel-collapsed left in place
  // TODO(port): template: 1 × md-expansion-panel-content left in place
  // TODO(port): template: 1 × md-expansion-panel-expanded left in place
  // TODO(port): template: 1 × md-expansion-panel-group left in place
  // TODO(port): template: 1 × md-expansion-panel-header left in place
  // TODO(port): template: 2 × md-expansion-panel-icon left in place
  // TODO(port): template: 1 × md-sidenav left in place

  $mdExpansionPanel: any = $mdExpansionPanel;
  types: any;
  isImport: any;
  isConfirmOnExit: any = false;
  errorTooltips: any = {};
  isFullscreen: any = false;
  editingRuleNode: any = null;
  isEditingRuleNode: any = false;
  editingRuleNodeLink: any = null;
  isEditingRuleNodeLink: any = false;
  isLibraryOpen: any = true;
  enableHotKeys: any = true;
  ruleNodeSearch: any = '';
  ruleChain: any = ruleChain;
  ruleChainMetaData: any = ruleChainMetaData;
  canvasControl: any = {};
  ruleChainModel: any = {
        nodes: [],
        edges: []
    };
  ruleNodeTypesModel: any = {};
  ruleNodeTypesCanvasControl: any = {};
  ruleChainLibraryLoaded: any = false;
  selectedObjects: any = [];
  modelservice: any;
  nodeLibCallbacks: any;
  editCallbacks: any;
  contextInfo: any;
  contextMenuEvent: any;
  editingRuleNodeAllowCustomLabels: any;
  editingRuleNodeIndex: any;
  editingRuleNodeLinkIndex: any;
  editingRuleNodeLinkLabels: any;
  inputConnectorId: any;
  isDirty: any;
  isInvalid: any;
  nextConnectorID: any;
  nextNodeID: any;
  ruleChainWatch: any;
  ruleNodeForm: any;
  ruleNodeLinkForm: any;
  searchConfig: any;
  tooltipTimeout: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $scope.$broadcast — a scope event: call the service that listens
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): $state.current — $state.current: this.router.url, or the ActivatedRoute snapshot
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    let vm = this;
    this.types = this.typesRef;
    if (this.router.current.data.import && !ruleChain) {
        this.router.go('home.ruleChains');
        return;
    }
    this.isImport = this.router.current.data.import;
    $scope.$watch(() => {
        return this.isDirty || this.isImport;
    }, (val?: any) => {
        this.isConfirmOnExit = val;
    });
    Object.defineProperty(this, 'isLibraryOpenReadonly', {
        get: (...rest: any[]) => { return this.isLibraryOpen },
        set: function(...rest: any[]) {}
    });
    for (var type in this.typesRef.ruleNodeType) {
        if (!this.typesRef.ruleNodeType[type].special) {
            this.ruleNodeTypesModel[type] = {
                model: {
                    nodes: [],
                    edges: []
                },
                selectedObjects: []
            };
            this.ruleNodeTypesCanvasControl[type] = {};
        }
    }
    this.modelservice = Modelfactory(this.ruleChainModel, this.selectedObjects);
    this.saveRuleChain = this.saveRuleChain;
    this.revertRuleChain = this.revertRuleChain;
    this.objectsSelected = this.objectsSelected;
    this.deleteSelected = this.deleteSelected;
    this.isDebugModeEnabled = this.isDebugModeEnabled;
    this.resetDebugModeInAllNodes = this.resetDebugModeInAllNodes;
    this.triggerResize = this.triggerResize;
    this.openRuleChainContextMenu = this.openRuleChainContextMenu;
    this.helpLinkIdForRuleNodeType = this.helpLinkIdForRuleNodeType;
    this.initHotKeys();
    this.nodeLibCallbacks = {
        nodeCallbacks: {
            'mouseEnter': (event?: any, node?: any, ...rest: any[]) => {
                this.displayLibNodeDescriptionTooltip(event, node);
            },
            'mouseLeave': (...rest: any[]) => {
                this.destroyTooltips();
            },
            'mouseDown': (...rest: any[]) => {
                this.destroyTooltips();
            }
        }
    };
    this.destroyTooltips = this.destroyTooltips;
    $scope.$watch(() => {
        return this.isEditingRuleNode || this.isEditingRuleNodeLink;
    }, (val?: any) => {
        this.enableHotKeys = !val;
        this.updateErrorTooltips(val);
    });
    this.editCallbacks = {
        edgeDoubleClick: (event?: any, edge?: any, ...rest: any[]) => {
            this.openLinkDetails(edge);
        },
        edgeEdit: (event?: any, edge?: any, ...rest: any[]) => {
            this.openLinkDetails(edge);
        },
        nodeCallbacks: {
            'doubleClick': (event?: any, node?: any, ...rest: any[]) => {
                this.openNodeDetails(node);
            },
            'nodeEdit': (event?: any, node?: any, ...rest: any[]) => {
                this.openNodeDetails(node);
            },
            'mouseEnter': (event?: any, node?: any, ...rest: any[]) => {
                this.displayNodeDescriptionTooltip(event, node);
            },
            'mouseLeave': (...rest: any[]) => {
                this.destroyTooltips();
            },
            'mouseDown': (...rest: any[]) => {
                this.destroyTooltips();
            }
        },
        isValidEdge: function (source?: any, destination?: any, ...rest: any[]) {
            return source.type === flowchartConstants.rightConnectorType && destination.type === flowchartConstants.leftConnectorType;
        },
        createEdge: (event?: any, edge?: any, ...rest: any[]) => {
            var deferred: any = $q.defer();
            var sourceNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.source);
            if (sourceNode.component.type == this.typesRef.ruleNodeType.INPUT.value) {
                var destNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.destination);
                if (destNode.component.type == this.typesRef.ruleNodeType.RULE_CHAIN.value) {
                    deferred.reject();
                } else {
                    var res: any = $filter('filter')(this.ruleChainModel.edges, {source: this.inputConnectorId}, true);
                    if (res && res.length) {
                        this.modelservice.edges.delete(res[0]);
                    }
                    deferred.resolve(edge);
                }
            } else {
                if (edge.label) {
                    if (!edge.labels) {
                        edge.labels = edge.label.split(' / ');
                    }
                    deferred.resolve(edge);
                } else {
                    var labels: any = this.ruleChainService.getRuleNodeSupportedLinks(sourceNode.component);
                    var allowCustomLabels: any = this.ruleChainService.ruleNodeAllowCustomLinks(sourceNode.component);
                    this.enableHotKeys = false;
                    this.addRuleNodeLink(event, edge, labels, allowCustomLabels).then(
                        (link?: any) => {
                            deferred.resolve(link);
                            this.enableHotKeys = true;
                        },
                        () => {
                            deferred.reject();
                            this.enableHotKeys = true;
                        }
                    );
                }
            }
            return deferred.promise;
        },
        dropNode: (event?: any, node?: any, ...rest: any[]) => {
            this.addRuleNode(event, node);
        }
    };
    this.loadRuleChainLibrary(ruleNodeComponents, true);
    $scope.$watch('vm.ruleNodeSearch',
        (newVal?: any, oldVal?: any) => {
            if (!angular.equals(newVal, oldVal)) {
                var res: any = $filter('filter')(ruleNodeComponents, {name: this.ruleNodeSearch});
                this.loadRuleChainLibrary(res);
            }
        }
    );
    $scope.$on('searchTextUpdated', () => {
        this.updateRuleNodesHighlight();
    });
  }

  openRuleChainContextMenu = ($event?: any, $mdOpenMousepointMenu?: any, ...rest: any[]): any => {
    if (this.canvasControl.modelservice && !$event.ctrlKey && !$event.metaKey) {
        var x: any = $event.clientX;
        var y: any = $event.clientY;
        var item: any = this.canvasControl.modelservice.getItemInfoAtPoint(x, y);
        this.contextInfo = this.prepareContextMenu(item);
        if (this.contextInfo.items && this.contextInfo.items.length > 0) {
            this.contextMenuEvent = $event;
            $mdOpenMousepointMenu($event);
            return false;
        }
    }
    return undefined;
  };

  prepareContextMenu(item?: any, ...rest: any[]): any {
    if (this.objectsSelected() || (!item.node && !item.edge)) {
        return this.prepareRuleChainContextMenu();
    } else if (item.node) {
        return this.prepareRuleNodeContextMenu(item.node);
    } else if (item.edge) {
        return this.prepareEdgeContextMenu(item.edge);
    }
    return undefined;
  }

  prepareRuleChainContextMenu(...rest: any[]): any {
    var contextInfo: any = {
        headerClass: 'tb-rulechain',
        icon: 'settings_ethernet',
        title: this.ruleChain.name,
        subtitle: this.translate.instant('rulechain.rulechain')
    };
    contextInfo.items = [];
    if (this.modelservice.nodes.getSelectedNodes().length) {
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.copyRuleNodes();
                },
                enabled: true,
                value: "rulenode.copy-selected",
                icon: "content_copy",
                shortcut: "M-C"
            }
        );
    }
    contextInfo.items.push(
        {
            action: ($event?: any, ...rest: any[]) => {
                this.pasteRuleNodes($event);
            },
            enabled: this.itembuffer.hasRuleNodes(),
            value: "action.paste",
            icon: "content_paste",
            shortcut: "M-V"
        }
    );
    contextInfo.items.push(
        {
            divider: true
        }
    );
    if (this.objectsSelected()) {
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.modelservice.deselectAll();
                },
                enabled: true,
                value: "rulenode.deselect-all",
                icon: "tab_unselected",
                shortcut: "Esc"
            }
        );
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.modelservice.deleteSelected();
                },
                enabled: true,
                value: "rulenode.delete-selected",
                icon: "clear",
                shortcut: "Del"
            }
        );
    } else {
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.modelservice.selectAll();
                },
                enabled: true,
                value: "rulenode.select-all",
                icon: "select_all",
                shortcut: "M-A"
            }
        );
    }
    contextInfo.items.push(
        {
            divider: true
        }
    );
    contextInfo.items.push(
        {
            action: (...rest: any[]) => {
                this.saveRuleChain();
            },
            enabled: !(this.isInvalid || (!this.isDirty && !this.isImport)),
            value: "action.apply-changes",
            icon: "done",
            shortcut: "M-S"
        }
    );
    contextInfo.items.push(
        {
            action: (...rest: any[]) => {
                this.revertRuleChain();
            },
            enabled: this.isDirty,
            value: "action.decline-changes",
            icon: "close",
            shortcut: "M-Z"
        }
    );
    return contextInfo;
  }

  prepareRuleNodeContextMenu(node?: any, ...rest: any[]): any {
    var contextInfo: any = {
        headerClass: node.nodeClass,
        icon: node.icon,
        iconUrl: node.iconUrl,
        title: node.name,
        subtitle: node.component.name
    };
    contextInfo.items = [];
    if (!node.readonly) {
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.openNodeDetails(node);
                },
                enabled: true,
                value: "rulenode.details",
                icon: "menu"
            }
        );
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.copyNode(node);
                },
                enabled: true,
                value: "action.copy",
                icon: "content_copy"
            }
        );
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.canvasControl.modelservice.nodes.delete(node);
                },
                enabled: true,
                value: "action.delete",
                icon: "clear",
                shortcut: "M-X"
            }
        );
    }
    return contextInfo;
  }

  prepareEdgeContextMenu(edge?: any, ...rest: any[]): any {
    var contextInfo: any = {
        headerClass: 'tb-link',
        icon: 'trending_flat',
        title: edge.label,
        subtitle: this.translate.instant('rulenode.link')
    };
    contextInfo.items = [];
    var sourceNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.source);
    if (sourceNode.component.type != this.typesRef.ruleNodeType.INPUT.value) {
        contextInfo.items.push(
            {
                action: (...rest: any[]) => {
                    this.openLinkDetails(edge);
                },
                enabled: true,
                value: "rulenode.details",
                icon: "menu"
            }
        );
    }
    contextInfo.items.push(
        {
            action: (...rest: any[]) => {
                this.canvasControl.modelservice.edges.delete(edge);
            },
            enabled: true,
            value: "action.delete",
            icon: "clear",
            shortcut: "M-X"
        }
    );
    return contextInfo;
  }

  initHotKeys(...rest: any[]): any {
    let ctrl = this;
    hotkeys.bindTo(this)
        .add({
            combo: 'ctrl+a',
            description: this.translate.instant('rulenode.select-all-objects'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    this.modelservice.selectAll();
                }
            }
        })
        .add({
            combo: 'ctrl+c',
            description: this.translate.instant('rulenode.copy-selected'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    this.copyRuleNodes();
                }
            }
        })
        .add({
            combo: 'ctrl+v',
            description: this.translate.instant('action.paste'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    if (this.itembuffer.hasRuleNodes()) {
                        this.pasteRuleNodes();
                    }
                }
            }
        })
        .add({
            combo: 'esc',
            description: this.translate.instant('rulenode.deselect-all-objects'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.modelservice.deselectAll();
                }
            }
        })
        .add({
            combo: 'ctrl+s',
            description: this.translate.instant('action.apply'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    this.saveRuleChain();
                }
            }
        })
        .add({
            combo: 'ctrl+z',
            description: this.translate.instant('action.decline-changes'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    this.revertRuleChain();
                }
            }
        })
        .add({
            combo: 'del',
            description: this.translate.instant('rulenode.delete-selected-objects'),
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: (event?: any, ...rest: any[]) => {
                if (this.enableHotKeys) {
                    event.preventDefault();
                    this.modelservice.deleteSelected();
                }
            }
        })
  }

  onEditRuleNodeClosed(...rest: any[]): any {
    this.editingRuleNode = null;
  }

  onEditRuleNodeLinkClosed(...rest: any[]): any {
    this.editingRuleNodeLink = null;
  }

  saveRuleNode(theForm?: any, ...rest: any[]): any {
    $scope.$broadcast('form-submit');
    if (theForm.$valid) {
        theForm.$setPristine();
        if (this.editingRuleNode.error) {
            delete this.editingRuleNode.error;
        }
        this.ruleChainModel.nodes[this.editingRuleNodeIndex] = this.editingRuleNode;
        this.editingRuleNode = structuredClone(this.editingRuleNode);
        this.updateRuleNodesHighlight();
    }
  }

  saveRuleNodeLink(theForm?: any, ...rest: any[]): any {
    theForm.$setPristine();
    this.ruleChainModel.edges[this.editingRuleNodeLinkIndex] = this.editingRuleNodeLink;
    this.editingRuleNodeLink = structuredClone(this.editingRuleNodeLink);
  }

  onRevertRuleNodeEdit(theForm?: any, ...rest: any[]): any {
    theForm.$setPristine();
    var node: any = this.ruleChainModel.nodes[this.editingRuleNodeIndex];
    this.editingRuleNode = structuredClone(node);
  }

  onRevertRuleNodeLinkEdit(theForm?: any, ...rest: any[]): any {
    theForm.$setPristine();
    var edge: any = this.ruleChainModel.edges[this.editingRuleNodeLinkIndex];
    this.editingRuleNodeLink = structuredClone(edge);
  }

  typeHeaderMouseEnter(event?: any, typeId?: any, ...rest: any[]): any {
    var ruleNodeType: any = this.typesRef.ruleNodeType[typeId];
    this.displayTooltip(event,
        '<div class="tb-rule-node-tooltip tb-lib-tooltip">' +
        '<div id="tb-node-content" layout="column">' +
        '<div class="tb-node-title">' + this.translate.instant(ruleNodeType.name) + '</div>' +
        '<div class="tb-node-details">' + this.translate.instant(ruleNodeType.details) + '</div>' +
        '</div>' +
        '</div>'
    );
  }

  helpLinkIdForRuleNodeType = (...rest: any[]): any => {
    return helpLinks.getRuleNodeLink(this.editingRuleNode);
  };

  destroyTooltips = (...rest: any[]): any => {
    if (this.tooltipTimeout) {
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = null;
    }
    var instances: any = angular.element.tooltipster.instances();
    instances.forEach((instance?: any) => {
        if (!instance.isErrorTooltip) {
            instance.destroy();
        }
    });
  };

  displayLibNodeDescriptionTooltip(event?: any, node?: any, ...rest: any[]): any {
    this.displayTooltip(event,
        '<div class="tb-rule-node-tooltip tb-lib-tooltip">' +
        '<div id="tb-node-content" layout="column">' +
        '<div class="tb-node-title">' + node.component.name + '</div>' +
        '<div class="tb-node-description">' + node.component.configurationDescriptor.nodeDefinition.description + '</div>' +
        '<div class="tb-node-details">' + node.component.configurationDescriptor.nodeDefinition.details + '</div>' +
        '</div>' +
        '</div>'
    );
  }

  displayNodeDescriptionTooltip(event?: any, node?: any, ...rest: any[]): any {
    if (!this.errorTooltips[node.id]) {
        var name: any, desc: any, details: any;
        if (node.component.type == this.types.ruleNodeType.INPUT.value) {
            name = this.translate.instant(this.types.ruleNodeType.INPUT.name) + '';
            desc = this.translate.instant(this.types.ruleNodeType.INPUT.details) + '';
        } else {
            name = node.name;
            desc = this.translate.instant(this.types.ruleNodeType[node.component.type].name) + ' - ' + node.component.name;
            if (node.additionalInfo) {
                details = node.additionalInfo.description;
            }
        }
        var tooltipContent: any = '<div class="tb-rule-node-tooltip">' +
            '<div id="tb-node-content" layout="column">' +
            '<div class="tb-node-title">' + name + '</div>' +
            '<div class="tb-node-description">' + desc + '</div>';
        if (details) {
            tooltipContent += '<div class="tb-node-details">' + details + '</div>';
        }
        tooltipContent += '</div>' +
            '</div>';
        this.displayTooltip(event, tooltipContent);
    }
  }

  displayTooltip(event?: any, content?: any, ...rest: any[]): any {
    this.destroyTooltips();
    this.tooltipTimeout = setTimeout(() => {
        var element: any = $(event.target);
        element.tooltipster(
            {
                theme: 'tooltipster-shadow',
                delay: 100,
                trigger: 'custom',
                triggerOpen: {
                    click: false,
                    tap: false
                },
                triggerClose: {
                    click: true,
                    tap: true,
                    scroll: true
                },
                side: 'right',
                trackOrigin: true
            }
        );
        var contentElement: any = $(content);
        $compile(contentElement)(this);
        var tooltip: any = element.tooltipster('instance');
        tooltip.content(contentElement);
        tooltip.open();
    }, 500);
  }

  updateNodeErrorTooltip(node?: any, ...rest: any[]): any {
    if (node.error) {
        var element: any = $('#' + node.id);
        var tooltip: any = this.errorTooltips[node.id];
        if (!tooltip || !element.hasClass("tooltipstered")) {
            element.tooltipster(
                {
                    theme: 'tooltipster-shadow',
                    delay: 0,
                    animationDuration: 0,
                    trigger: 'custom',
                    triggerOpen: {
                        click: false,
                        tap: false
                    },
                    triggerClose: {
                        click: false,
                        tap: false,
                        scroll: false
                    },
                    side: 'top',
                    trackOrigin: true
                }
            );
            var content: any = '<div class="tb-rule-node-error-tooltip">' +
                '<div id="tooltip-content" layout="column">' +
                '<div class="tb-node-details">' + node.error + '</div>' +
                '</div>' +
                '</div>';
            var contentElement: any = $(content);
            $compile(contentElement)(this);
            tooltip = element.tooltipster('instance');
            tooltip.isErrorTooltip = true;
            tooltip.content(contentElement);
            this.errorTooltips[node.id] = tooltip;
        }
        $mdUtil.nextTick(() => {
            tooltip.open();
        });
    } else {
        if (this.errorTooltips[node.id]) {
            tooltip = this.errorTooltips[node.id];
            tooltip.destroy();
            delete this.errorTooltips[node.id];
        }
    }
  }

  updateErrorTooltips(hide?: any, ...rest: any[]): any {
    for (var nodeId in this.errorTooltips) {
        var tooltip: any = this.errorTooltips[nodeId];
        if (hide) {
            tooltip.close();
        } else {
            tooltip.open();
        }
    }
  }

  openNodeDetails(node?: any, ...rest: any[]): any {
    if (node.component.type != this.typesRef.ruleNodeType.INPUT.value) {
        this.isEditingRuleNodeLink = false;
        this.editingRuleNodeLink = null;
        this.isEditingRuleNode = true;
        this.editingRuleNodeIndex = this.ruleChainModel.nodes.indexOf(node);
        this.editingRuleNode = structuredClone(node);
        $mdUtil.nextTick(() => {
            if (this.ruleNodeForm) {
                this.ruleNodeForm.$setPristine();
            }
        });
    }
  }

  openLinkDetails(edge?: any, ...rest: any[]): any {
    var sourceNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.source);
    if (sourceNode.component.type != this.typesRef.ruleNodeType.INPUT.value) {
        this.isEditingRuleNode = false;
        this.editingRuleNode = null;
        this.editingRuleNodeLinkLabels = this.ruleChainService.getRuleNodeSupportedLinks(sourceNode.component);
        this.editingRuleNodeAllowCustomLabels = this.ruleChainService.ruleNodeAllowCustomLinks(sourceNode.component);
        this.isEditingRuleNodeLink = true;
        this.editingRuleNodeLinkIndex = this.ruleChainModel.edges.indexOf(edge);
        this.editingRuleNodeLink = structuredClone(edge);
        $mdUtil.nextTick(() => {
            if (this.ruleNodeLinkForm) {
                this.ruleNodeLinkForm.$setPristine();
            }
        });
    }
  }

  copyNode(node?: any, ...rest: any[]): any {
    this.itembuffer.copyRuleNodes([node], []);
  }

  copyRuleNodes(...rest: any[]): any {
    var nodes: any = this.modelservice.nodes.getSelectedNodes();
    var edges: any = this.modelservice.edges.getSelectedEdges();
    var connections: any = [];
    for (var i: any=0;i<edges.length;i++) {
        var edge: any = edges[i];
        var sourceNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.source);
        var destNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.destination);
        var isInputSource: any = sourceNode.component.type == this.typesRef.ruleNodeType.INPUT.value;
        var fromIndex: any = nodes.indexOf(sourceNode);
        var toIndex: any = nodes.indexOf(destNode);
        if ( (isInputSource || fromIndex > -1) && toIndex > -1 ) {
            var connection: any = {
                isInputSource: isInputSource,
                fromIndex: fromIndex,
                toIndex: toIndex,
                label: edge.label,
                labels: edge.labels
            };
            connections.push(connection);
        }
    }
    this.itembuffer.copyRuleNodes(nodes, connections);
  }

  pasteRuleNodes(event?: any, ...rest: any[]): any {
    var canvas: any = $(this.canvasControl.modelservice.getCanvasHtmlElement());
    var x: any,y: any;
    if (event) {
        var offset: any = canvas.offset();
        x = Math.round(event.clientX - offset.left);
        y = Math.round(event.clientY - offset.top);
    } else {
        var scrollParent: any = canvas.parent();
        var scrollTop: any = scrollParent.scrollTop();
        var scrollLeft: any = scrollParent.scrollLeft();
        x = scrollLeft + scrollParent.width()/2;
        y = scrollTop + scrollParent.height()/2;
    }
    var ruleNodes: any = this.itembuffer.pasteRuleNodes(x, y, event);
    if (ruleNodes) {
        this.modelservice.deselectAll();
        var nodes: any = [];
        for (var i: any=0;i<ruleNodes.nodes.length;i++) {
            var node: any = ruleNodes.nodes[i];
            node.id = 'rule-chain-node-' + this.nextNodeID++;
            var component: any = node.component;
            if (component.configurationDescriptor.nodeDefinition.inEnabled) {
                node.connectors.push(
                    {
                        type: flowchartConstants.leftConnectorType,
                        id: this.nextConnectorID++
                    }
                );
            }
            if (component.configurationDescriptor.nodeDefinition.outEnabled) {
                node.connectors.push(
                    {
                        type: flowchartConstants.rightConnectorType,
                        id: this.nextConnectorID++
                    }
                );
            }
            nodes.push(node);
            this.ruleChainModel.nodes.push(node);
            this.modelservice.nodes.select(node);
        }
        for (i=0;i<ruleNodes.connections.length;i++) {
            var connection: any = ruleNodes.connections[i];
            var sourceNode: any = nodes[connection.fromIndex];
            var destNode: any = nodes[connection.toIndex];
            if ( (connection.isInputSource || sourceNode) &&  destNode ) {
                var source: any, destination: any;
                if (connection.isInputSource) {
                    source = this.inputConnectorId;
                } else {
                    var sourceConnectors: any = this.modelservice.nodes.getConnectorsByType(sourceNode, flowchartConstants.rightConnectorType);
                    if (sourceConnectors && sourceConnectors.length) {
                        source = sourceConnectors[0].id;
                    }
                }
                var destConnectors: any = this.modelservice.nodes.getConnectorsByType(destNode, flowchartConstants.leftConnectorType);
                if (destConnectors && destConnectors.length) {
                    destination = destConnectors[0].id;
                }
                if (source && destination) {
                    var edge: any = {
                        source: source,
                        destination: destination,
                        label: connection.label,
                        labels: connection.labels
                    };
                    this.ruleChainModel.edges.push(edge);
                    this.modelservice.edges.select(edge);
                }
            }
        }

        if (this.canvasControl.adjustCanvasSize) {
            this.canvasControl.adjustCanvasSize();
        }

        this.updateRuleNodesHighlight();

        this.validate();
    }
  }

  loadRuleChainLibrary(ruleNodeComponents?: any, loadRuleChain?: any, ...rest: any[]): any {
    for (var componentType in this.ruleNodeTypesModel) {
        this.ruleNodeTypesModel[componentType].model.nodes.length = 0;
    }
    for (var i: any=0;i<ruleNodeComponents.length;i++) {
        var ruleNodeComponent: any = ruleNodeComponents[i];
        componentType = ruleNodeComponent.type;
        var model: any = this.ruleNodeTypesModel[componentType].model;
        var icon: any = this.types.ruleNodeType[componentType].icon;
        var iconUrl: any = null;
        if (ruleNodeComponent.configurationDescriptor.nodeDefinition.icon) {
            icon = ruleNodeComponent.configurationDescriptor.nodeDefinition.icon;
        }
        if (ruleNodeComponent.configurationDescriptor.nodeDefinition.iconUrl) {
            iconUrl = ruleNodeComponent.configurationDescriptor.nodeDefinition.iconUrl;
        }
        var node: any = {
            id: 'node-lib-' + componentType + '-' + model.nodes.length,
            component: ruleNodeComponent,
            name: '',
            nodeClass: this.types.ruleNodeType[componentType].nodeClass,
            icon: icon,
            iconUrl: iconUrl,
            x: 30,
            y: 10+50*model.nodes.length,
            connectors: []
        };
        if (ruleNodeComponent.configurationDescriptor.nodeDefinition.inEnabled) {
            node.connectors.push(
                {
                    type: flowchartConstants.leftConnectorType,
                    id: model.nodes.length * 2
                }
            );
        }
        if (ruleNodeComponent.configurationDescriptor.nodeDefinition.outEnabled) {
            node.connectors.push(
                {
                    type: flowchartConstants.rightConnectorType,
                    id: model.nodes.length * 2 + 1
                }
            );
        }
        model.nodes.push(node);
    }
    this.ruleChainLibraryLoaded = true;
    if (loadRuleChain) {
        this.prepareRuleChain();
    }
    $mdUtil.nextTick(() => {
        for (componentType in this.ruleNodeTypesCanvasControl) {
            if (this.ruleNodeTypesCanvasControl[componentType].adjustCanvasSize) {
                this.ruleNodeTypesCanvasControl[componentType].adjustCanvasSize(true);
            }
        }
        for (componentType in this.ruleNodeTypesModel) {
            var panel: any = this.$mdExpansionPanel(componentType);
            if (panel) {
                if (!this.ruleNodeTypesModel[componentType].model.nodes.length) {
                    panel.collapse();
                } else {
                    panel.expand();
                }
            }
        }
    });
  }

  prepareRuleChain(...rest: any[]): any {

    if (this.ruleChainWatch) {
        this.ruleChainWatch();
        this.ruleChainWatch = null;
    }

    this.nextNodeID = 1;
    this.nextConnectorID = 1;

    this.selectedObjects.length = 0;
    this.ruleChainModel.nodes.length = 0;
    this.ruleChainModel.edges.length = 0;

    this.inputConnectorId = this.nextConnectorID++;

    this.ruleChainModel.nodes.push(
        {
            id: 'rule-chain-node-' + this.nextNodeID++,
            component: this.typesRef.inputNodeComponent,
            name: "",
            nodeClass: this.typesRef.ruleNodeType.INPUT.nodeClass,
            icon: this.typesRef.ruleNodeType.INPUT.icon,
            readonly: true,
            x: 50,
            y: 150,
            connectors: [
                {
                    type: flowchartConstants.rightConnectorType,
                    id: this.inputConnectorId
                },
            ]

        }
    );
    this.ruleChainService.resolveTargetRuleChains(this.ruleChainMetaData.ruleChainConnections)
        .then((ruleChainsMap?: any) => {
            this.createRuleChainModel(ruleChainsMap);
        }
    );
  }

  createRuleChainModel(ruleChainsMap?: any, ...rest: any[]): any {
    let vm = this;
    var nodes: any = [];
    for (var i: any=0;i<this.ruleChainMetaData.nodes.length;i++) {
        var ruleNode: any = this.ruleChainMetaData.nodes[i];
        var component: any = this.ruleChainService.getRuleNodeComponentByClazz(ruleNode.type);
        if (component) {
            var icon: any = this.types.ruleNodeType[component.type].icon;
            var iconUrl: any = null;
            if (component.configurationDescriptor.nodeDefinition.icon) {
                icon = component.configurationDescriptor.nodeDefinition.icon;
            }
            if (component.configurationDescriptor.nodeDefinition.iconUrl) {
                iconUrl = component.configurationDescriptor.nodeDefinition.iconUrl;
            }
            var node: any = {
                id: 'rule-chain-node-' + this.nextNodeID++,
                ruleNodeId: ruleNode.id,
                additionalInfo: ruleNode.additionalInfo,
                configuration: ruleNode.configuration,
                debugMode: ruleNode.debugMode,
                x: Math.round(ruleNode.additionalInfo.layoutX),
                y: Math.round(ruleNode.additionalInfo.layoutY),
                component: component,
                name: ruleNode.name,
                nodeClass: this.types.ruleNodeType[component.type].nodeClass,
                icon: icon,
                iconUrl: iconUrl,
                connectors: []
            };
            if (component.configurationDescriptor.nodeDefinition.inEnabled) {
                node.connectors.push(
                    {
                        type: flowchartConstants.leftConnectorType,
                        id: this.nextConnectorID++
                    }
                );
            }
            if (component.configurationDescriptor.nodeDefinition.outEnabled) {
                node.connectors.push(
                    {
                        type: flowchartConstants.rightConnectorType,
                        id: this.nextConnectorID++
                    }
                );
            }
            nodes.push(node);
            this.ruleChainModel.nodes.push(node);
        }
    }

    if (this.ruleChainMetaData.firstNodeIndex > -1) {
        var destNode: any = nodes[this.ruleChainMetaData.firstNodeIndex];
        if (destNode) {
            var connectors: any = this.modelservice.nodes.getConnectorsByType(destNode, flowchartConstants.leftConnectorType);
            if (connectors && connectors.length) {
                var edge: any = {
                    source: this.inputConnectorId,
                    destination: connectors[0].id
                };
                this.ruleChainModel.edges.push(edge);
            }
        }
    }

    if (this.ruleChainMetaData.connections) {
        var edgeMap: any = {};
        for (i = 0; i < this.ruleChainMetaData.connections.length; i++) {
            var connection: any = this.ruleChainMetaData.connections[i];
            var sourceNode: any = nodes[connection.fromIndex];
            destNode = nodes[connection.toIndex];
            if (sourceNode && destNode) {
                var sourceConnectors: any = this.modelservice.nodes.getConnectorsByType(sourceNode, flowchartConstants.rightConnectorType);
                var destConnectors: any = this.modelservice.nodes.getConnectorsByType(destNode, flowchartConstants.leftConnectorType);
                if (sourceConnectors && sourceConnectors.length && destConnectors && destConnectors.length) {
                    var sourceId: any = sourceConnectors[0].id;
                    var destId: any = destConnectors[0].id;
                    var edgeKey: any = sourceId + '_' + destId;
                    edge = edgeMap[edgeKey];
                    if (!edge) {
                        edge = {
                            source: sourceId,
                            destination: destId,
                            label: connection.type,
                            labels: [connection.type]
                        };
                        edgeMap[edgeKey] = edge;
                        this.ruleChainModel.edges.push(edge);
                    } else {
                        edge.label += ' / ' +connection.type;
                        edge.labels.push(connection.type);
                    }
                }
            }
        }
    }

    if (this.ruleChainMetaData.ruleChainConnections) {
        var ruleChainNodesMap: any = {};
        var ruleChainEdgeMap: any = {};
        for (i = 0; i < this.ruleChainMetaData.ruleChainConnections.length; i++) {
            var ruleChainConnection: any = this.ruleChainMetaData.ruleChainConnections[i];
            var ruleChain: any = ruleChainsMap[ruleChainConnection.targetRuleChainId.id];
            if (ruleChainConnection.additionalInfo && ruleChainConnection.additionalInfo.ruleChainNodeId) {
                var ruleChainNode: any = ruleChainNodesMap[ruleChainConnection.additionalInfo.ruleChainNodeId];
                if (!ruleChainNode) {
                    ruleChainNode = {
                        id: 'rule-chain-node-' + this.nextNodeID++,
                        additionalInfo: ruleChainConnection.additionalInfo,
                        x: Math.round(ruleChainConnection.additionalInfo.layoutX),
                        y: Math.round(ruleChainConnection.additionalInfo.layoutY),
                        component: this.typesRef.ruleChainNodeComponent,
                        nodeClass: this.types.ruleNodeType.RULE_CHAIN.nodeClass,
                        icon: this.types.ruleNodeType.RULE_CHAIN.icon,
                        connectors: [
                            {
                                type: flowchartConstants.leftConnectorType,
                                id: this.nextConnectorID++
                            }
                        ]
                    };
                    if (ruleChain.name) {
                        ruleChainNode.name = ruleChain.name;
                        ruleChainNode.targetRuleChainId = ruleChainConnection.targetRuleChainId.id;
                    } else {
                        ruleChainNode.name = "Unresolved";
                        ruleChainNode.targetRuleChainId = null;
                        ruleChainNode.error = this.translate.instant('rulenode.invalid-target-rulechain');
                    }
                    ruleChainNodesMap[ruleChainConnection.additionalInfo.ruleChainNodeId] = ruleChainNode;
                    this.ruleChainModel.nodes.push(ruleChainNode);
                }
                sourceNode = nodes[ruleChainConnection.fromIndex];
                if (sourceNode) {
                    connectors = this.modelservice.nodes.getConnectorsByType(sourceNode, flowchartConstants.rightConnectorType);
                    if (connectors && connectors.length) {
                        sourceId = connectors[0].id;
                        destId = ruleChainNode.connectors[0].id;
                        edgeKey = sourceId + '_' + destId;
                        var ruleChainEdge: any = ruleChainEdgeMap[edgeKey];
                        if (!ruleChainEdge) {
                            ruleChainEdge = {
                                source: sourceId,
                                destination: destId,
                                label: ruleChainConnection.type,
                                labels: [ruleChainConnection.type]
                            };
                            ruleChainEdgeMap[edgeKey] = ruleChainEdge;
                            this.ruleChainModel.edges.push(ruleChainEdge);
                        } else {
                            ruleChainEdge.label += ' / ' +ruleChainConnection.type;
                            ruleChainEdge.labels.push(ruleChainConnection.type);
                        }
                    }
                }
            }
        }
    }

    if (this.canvasControl.adjustCanvasSize) {
        this.canvasControl.adjustCanvasSize(true);
    }

    this.isDirty = false;

    this.updateRuleNodesHighlight();

    this.validate();

    $mdUtil.nextTick(() => {
        this.ruleChainWatch = $scope.$watch('vm.ruleChainModel',
            (newVal?: any, oldVal?: any) => {
                if (!angular.equals(newVal, oldVal)) {
                    this.validate();
                    if (!this.isDirty) {
                        this.isDirty = true;
                    }
                }
            }, true
        );
    });
  }

  updateRuleNodesHighlight(...rest: any[]): any {
    for (var i: any = 0; i < this.ruleChainModel.nodes.length; i++) {
        this.ruleChainModel.nodes[i].highlighted = false;
    }
    if (this.searchConfig.searchText) {
        var res: any = $filter('filter')(this.ruleChainModel.nodes, {name: this.searchConfig.searchText});
        if (res) {
            for (i = 0; i < res.length; i++) {
                res[i].highlighted = true;
            }
        }
    }
  }

  validate(...rest: any[]): any {
    $mdUtil.nextTick(() => {
        this.isInvalid = false;
        for (var i: any = 0; i < this.ruleChainModel.nodes.length; i++) {
            if (this.ruleChainModel.nodes[i].error) {
                this.isInvalid = true;
            }
            this.updateNodeErrorTooltip(this.ruleChainModel.nodes[i]);
        }
    });
  }

  saveRuleChain = (...rest: any[]): any => {
    var saveRuleChainPromise: any;
    if (this.isImport) {
        saveRuleChainPromise = this.ruleChainService.saveRuleChain(this.ruleChain);
    } else {
        saveRuleChainPromise = Promise.resolve(this.ruleChain);
    }
    saveRuleChainPromise.then(
        (ruleChain?: any) => {
            this.ruleChain = ruleChain;
            var ruleChainMetaData: any = {
                ruleChainId: this.ruleChain.id,
                nodes: [],
                connections: [],
                ruleChainConnections: []
            };

            var nodes: any = [];

            for (var i: any=0;i<this.ruleChainModel.nodes.length;i++) {
                var node: any = this.ruleChainModel.nodes[i];
                if (node.component.type != this.typesRef.ruleNodeType.INPUT.value && node.component.type != this.typesRef.ruleNodeType.RULE_CHAIN.value) {
                    var ruleNode: any = {};
                    if (node.ruleNodeId) {
                        ruleNode.id = node.ruleNodeId;
                    }
                    ruleNode.type = node.component.clazz;
                    ruleNode.name = node.name;
                    ruleNode.configuration = node.configuration;
                    ruleNode.additionalInfo = node.additionalInfo;
                    ruleNode.debugMode = node.debugMode;
                    if (!ruleNode.additionalInfo) {
                        ruleNode.additionalInfo = {};
                    }
                    ruleNode.additionalInfo.layoutX = Math.round(node.x);
                    ruleNode.additionalInfo.layoutY = Math.round(node.y);
                    ruleChainMetaData.nodes.push(ruleNode);
                    nodes.push(node);
                }
            }
            var res: any = $filter('filter')(this.ruleChainModel.edges, {source: this.inputConnectorId}, true);
            if (res && res.length) {
                var firstNodeEdge: any = res[0];
                var firstNode: any = this.modelservice.nodes.getNodeByConnectorId(firstNodeEdge.destination);
                ruleChainMetaData.firstNodeIndex = nodes.indexOf(firstNode);
            }
            for (i=0;i<this.ruleChainModel.edges.length;i++) {
                var edge: any = this.ruleChainModel.edges[i];
                var sourceNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.source);
                var destNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.destination);
                if (sourceNode.component.type != this.typesRef.ruleNodeType.INPUT.value) {
                    var fromIndex: any = nodes.indexOf(sourceNode);
                    if (destNode.component.type == this.typesRef.ruleNodeType.RULE_CHAIN.value) {
                        var ruleChainConnection: any = {
                            fromIndex: fromIndex,
                            targetRuleChainId: {entityType: this.types.entityType.rulechain, id: destNode.targetRuleChainId},
                            additionalInfo: destNode.additionalInfo
                        };
                        if (!ruleChainConnection.additionalInfo) {
                            ruleChainConnection.additionalInfo = {};
                        }
                        ruleChainConnection.additionalInfo.layoutX = Math.round(destNode.x);
                        ruleChainConnection.additionalInfo.layoutY = Math.round(destNode.y);
                        ruleChainConnection.additionalInfo.ruleChainNodeId = destNode.id;
                        for (var rcIndex: any=0;rcIndex<edge.labels.length;rcIndex++) {
                            var newRuleChainConnection: any = structuredClone(ruleChainConnection);
                            newRuleChainConnection.type = edge.labels[rcIndex];
                            ruleChainMetaData.ruleChainConnections.push(newRuleChainConnection);
                        }
                    } else {
                        var toIndex: any = nodes.indexOf(destNode);
                        var nodeConnection: any = {
                            fromIndex: fromIndex,
                            toIndex: toIndex
                        };
                        for (var cIndex: any=0;cIndex<edge.labels.length;cIndex++) {
                            var newNodeConnection: any = structuredClone(nodeConnection);
                            newNodeConnection.type = edge.labels[cIndex];
                            ruleChainMetaData.connections.push(newNodeConnection);
                        }
                    }
                }
            }
            this.ruleChainService.saveRuleChainMetaData(ruleChainMetaData).then(
                (ruleChainMetaData?: any) => {
                    this.ruleChainMetaData = ruleChainMetaData;
                    if (this.isImport) {
                        this.isDirty = false;
                        this.isImport = false;
                        $mdUtil.nextTick(() => {
                            this.router.go('home.ruleChains.ruleChain', {ruleChainId: this.ruleChain.id.id});
                        });
                    } else {
                        this.prepareRuleChain();
                    }
                }
            );
        }
    );
  };

  revertRuleChain = (...rest: any[]): any => {
    this.prepareRuleChain();
  };

  addRuleNode($event?: any, ruleNode?: any, ...rest: any[]): any {
    let vm = this;

    ruleNode.configuration = structuredClone(ruleNode.component.configurationDescriptor.nodeDefinition.defaultConfiguration);

    var ruleChainId: any = this.ruleChain.id ? this.ruleChain.id.id : null;

    this.enableHotKeys = false;

    this.dialog.show({
        controller: 'AddRuleNodeController',
        controllerAs: 'vm',
        templateUrl: addRuleNodeTemplate,
        parent: $(this.document.body),
        locals: {ruleNode: ruleNode, ruleChainId: ruleChainId},
        fullscreen: true,
        targetEvent: $event
    }).then((ruleNode?: any) => {
        ruleNode.id = 'rule-chain-node-' + this.nextNodeID++;
        ruleNode.connectors = [];
        if (ruleNode.component.configurationDescriptor.nodeDefinition.inEnabled) {
            ruleNode.connectors.push(
                {
                    id: this.nextConnectorID++,
                    type: flowchartConstants.leftConnectorType
                }
            );
        }
        if (ruleNode.component.configurationDescriptor.nodeDefinition.outEnabled) {
            ruleNode.connectors.push(
                {
                    id: this.nextConnectorID++,
                    type: flowchartConstants.rightConnectorType
                }
            );
        }
        this.ruleChainModel.nodes.push(ruleNode);
        this.updateRuleNodesHighlight();
        this.enableHotKeys = true;
    }, () => {
        this.enableHotKeys = true;
    });
  }

  addRuleNodeLink($event?: any, link?: any, labels?: any, allowCustomLabels?: any, ...rest: any[]): any {
    let vm = this;
    return this.dialog.show({
        controller: 'AddRuleNodeLinkController',
        controllerAs: 'vm',
        templateUrl: addRuleNodeLinkTemplate,
        parent: $(this.document.body),
        locals: {link: link, labels: labels, allowCustomLabels: allowCustomLabels},
        fullscreen: true,
        targetEvent: $event
    });
  }

  objectsSelected = (...rest: any[]): any => {
    return this.modelservice.nodes.getSelectedNodes().length > 0 ||
        this.modelservice.edges.getSelectedEdges().length > 0
  };

  deleteSelected = (...rest: any[]): any => {
    this.modelservice.deleteSelected();
  };

  isDebugModeEnabled = (...rest: any[]): any => {
    var res: any = $filter('filter')(this.ruleChainModel.nodes, {debugMode: true});
    return (res && res.length);
  };

  resetDebugModeInAllNodes = (...rest: any[]): any => {
    this.ruleChainModel.nodes.forEach((node?: any) => {
        if (node.component.type != this.typesRef.ruleNodeType.INPUT.value && node.component.type != this.typesRef.ruleNodeType.RULE_CHAIN.value) {
            node.debugMode = false;
        }
    });
  };

  triggerResize = (...rest: any[]): any => {
    var w: any = $($window);
    w.triggerHandler('resize');
  };

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
