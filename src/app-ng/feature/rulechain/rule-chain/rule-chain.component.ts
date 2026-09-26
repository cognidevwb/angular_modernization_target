import { Component, DoCheck, ElementRef, HostListener, OnDestroy, forwardRef, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import $ from 'jquery';
import 'tooltipster';
import { ItembufferService } from '../../services/itembuffer.service';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { helpLinks } from '../../help/constants/help-links';
import { types } from '../../common/constants/types';
import { TbExpandFullscreenDirective } from '../../components/tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';
import { TbDetailsSidenavDirective } from '../../components/tb-details-sidenav/tb-details-sidenav.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbRuleNodeDirective } from '../tb-rule-node/tb-rule-node.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRuleNodeLinkDirective } from '../tb-rule-node-link/tb-rule-node-link.directive';
import { RuleChainCanvasComponent } from '../rule-chain-canvas/rule-chain-canvas.component';
import { FlowchartModelService, flowchartConstants } from '../rule-chain-canvas/flowchart-model';
import { AddRuleNodeComponent } from '../add-rule-node/add-rule-node.component';
import { AddRuleNodeLinkComponent } from '../add-rule-node-link/add-rule-node-link.component';
import { RootState } from '../../../root-state';
import { goState } from '../../../state-paths';
import { KeyboardShortcutPipe } from '../../components/pipes/keyboard-shortcut.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

/** AngularJS's `filter` filter with `{prop: text}`: a case-insensitive substring match; an empty text matches all. */
function filterByProperty(list: any[], prop: string, text: any): any[] {
  if (text === undefined || text === null || text === '') {
    return list.slice();
  }
  const needle = String(text).toLowerCase();
  return list.filter((item) => {
    const value = item?.[prop];
    return value !== undefined && value !== null && String(value).toLowerCase().indexOf(needle) !== -1;
  });
}

/** `angular.copy`: a deep copy of plain objects and arrays; functions and other instances are kept by reference. */
function deepCopy<T>(source: T): T {
  if (Array.isArray(source)) {
    return source.map((item) => deepCopy(item)) as unknown as T;
  }
  if (source && typeof source === 'object' && Object.getPrototypeOf(source) === Object.prototype) {
    const result: any = {};
    for (const key of Object.keys(source)) {
      result[key] = deepCopy((source as any)[key]);
    }
    return result;
  }
  return source;
}

/** The fields of the canvas model the unsaved-changes check compares (the legacy deep `$watch`), without the component descriptors. */
function modelSnapshot(model: any): string {
  return JSON.stringify(model, (key, value) => {
    if (key === 'component') {
      return value?.clazz ?? value?.type;
    }
    if (key === 'highlighted') {
      return undefined;
    }
    return value;
  });
}

/**
 * Ported from the AngularJS controller `RuleChainController` (module `thingsboard.ruleChain`) in src/app/rulechain/rulechain.controller.js.
 * The ngFlowchart canvas is `tb-rule-chain-canvas` (same model: nodes with x/y and connectors, edges between connector ids).
 */
@Component({
  selector: 'rule-chain',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatTabsModule, MatMenuModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, MatExpansionModule, KeyboardShortcutPipe, FormsModule, RuleChainCanvasComponent, forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbConfirmOnExitDirective), forwardRef(() => TbDetailsSidenavDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbRuleNodeDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRuleNodeLinkDirective)],
  templateUrl: './rule-chain.component.html',
  styles: [`
    .tb-rulechain-library { display: flex; flex-direction: column; }
    .tb-rulechain-library .tb-rulechain-library-panel-group { display: block; flex: 1; }
    :host ::ng-deep .tb-rulechain-library .mat-expansion-panel-body { padding: 0; }
    .tb-rulechain-graph-container { position: relative; flex: 1; }
    .tb-context-menu-anchor { position: fixed; width: 0; height: 0; }
  `],
})
export class RuleChainComponent implements DoCheck, OnDestroy {
  protected readonly rootScope = inject(RootState);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly ruleChainService = inject(RuleChainService);
  protected readonly itembuffer = inject(ItembufferService);
  protected readonly typesRef: any = types;

  private readonly contextMenuTrigger = viewChild<MatMenuTrigger>('contextMenuTrigger');
  private readonly contextMenuAnchor = viewChild<ElementRef<HTMLElement>>('contextMenuAnchor');
  private readonly ruleNodeFormRef = viewChild<NgForm>('ruleNodeNgForm');
  private readonly ruleNodeLinkFormRef = viewChild<NgForm>('ruleNodeLinkNgForm');

  types: any;
  isImport: any;
  errorTooltips: any = {};
  isFullscreen: any = false;
  editingRuleNode: any = null;
  isEditingRuleNode: any = false;
  editingRuleNodeLink: any = null;
  isEditingRuleNodeLink: any = false;
  isLibraryOpen: any = true;
  enableHotKeys: any = true;
  ruleNodeSearch: any = '';
  ruleChain: any = null;
  ruleChainMetaData: any = null;
  ruleNodeComponents: any[] = [];
  canvasControl: any = {};
  ruleChainModel: any = {
        nodes: [],
        edges: []
    };
  ruleNodeTypesModel: any = {};
  ruleNodeTypesCanvasControl: any = {};
  libraryPanelExpanded: Record<string, boolean> = {};
  ruleChainLibraryLoaded: any = false;
  selectedObjects: any = [];
  selectedRuleNodeTabIndex = 0;
  modelservice: FlowchartModelService;
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
  tooltipTimeout: any;

  /** The deep watch on the canvas model: its last seen state, or null while not watching. */
  private watchedModel: string | null = null;
  private lastEditing = false;
  private readonly searchSub: () => void;

  get isConfirmOnExit(): boolean {
    return !!(this.isDirty || this.isImport);
  }

  get ruleNodeForm(): NgForm | undefined {
    return this.ruleNodeFormRef();
  }

  get ruleNodeLinkForm(): NgForm | undefined {
    return this.ruleNodeLinkFormRef();
  }

  constructor() {
    this.types = this.typesRef;
    this.isImport = this.route.snapshot.data['import'];
    for (const type in this.typesRef.ruleNodeType) {
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
    this.modelservice = new FlowchartModelService(this.ruleChainModel, this.selectedObjects);
    this.nodeLibCallbacks = {
        nodeCallbacks: {
            'mouseEnter': (event?: any, node?: any) => {
                this.displayLibNodeDescriptionTooltip(event, node);
            },
            'mouseLeave': () => {
                this.destroyTooltips();
            },
            'mouseDown': () => {
                this.destroyTooltips();
            }
        }
    };
    this.editCallbacks = {
        edgeDoubleClick: (event?: any, edge?: any) => {
            this.openLinkDetails(edge);
        },
        edgeEdit: (event?: any, edge?: any) => {
            this.openLinkDetails(edge);
        },
        nodeCallbacks: {
            'doubleClick': (event?: any, node?: any) => {
                this.openNodeDetails(node);
            },
            'nodeEdit': (event?: any, node?: any) => {
                this.openNodeDetails(node);
            },
            'mouseEnter': (event?: any, node?: any) => {
                this.displayNodeDescriptionTooltip(event, node);
            },
            'mouseLeave': () => {
                this.destroyTooltips();
            },
            'mouseDown': () => {
                this.destroyTooltips();
            }
        },
        isValidEdge: (source?: any, destination?: any) => {
            return source.type === flowchartConstants.rightConnectorType && destination.type === flowchartConstants.leftConnectorType;
        },
        createEdge: (event?: any, edge?: any): Promise<any> => {
            const sourceNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.source);
            if (sourceNode.component.type == this.typesRef.ruleNodeType.INPUT.value) {
                const destNode: any = this.modelservice.nodes.getNodeByConnectorId(edge.destination);
                if (destNode.component.type == this.typesRef.ruleNodeType.RULE_CHAIN.value) {
                    return Promise.reject();
                }
                const res: any[] = this.ruleChainModel.edges.filter((e: any) => e.source === this.inputConnectorId);
                if (res.length) {
                    this.modelservice.edges.delete(res[0]);
                }
                return Promise.resolve(edge);
            }
            if (edge.label) {
                if (!edge.labels) {
                    edge.labels = edge.label.split(' / ');
                }
                return Promise.resolve(edge);
            }
            const labels: any = this.ruleChainService.getRuleNodeSupportedLinks(sourceNode.component);
            const allowCustomLabels: any = this.ruleChainService.ruleNodeAllowCustomLinks(sourceNode.component);
            this.enableHotKeys = false;
            return this.addRuleNodeLink(event, edge, labels, allowCustomLabels).then(
                (link?: any) => {
                    this.enableHotKeys = true;
                    return link;
                },
                () => {
                    this.enableHotKeys = true;
                    return Promise.reject();
                }
            );
        },
        dropNode: (event?: any, node?: any) => {
            this.addRuleNode(event, node);
        }
    };
    this.searchSub = this.rootScope.$on('searchTextUpdated', () => {
        this.updateRuleNodesHighlight();
    });
    this.load();
  }

  /** The legacy state's resolves: the rule chain, its metadata and the rule node components. */
  private async load(): Promise<void> {
    let ruleChain: any;
    let ruleChainMetaData: any;
    if (this.isImport) {
        const ruleChainImport: any = history.state?.ruleChainImport;
        ruleChain = ruleChainImport?.ruleChain;
        ruleChainMetaData = ruleChainImport?.metadata;
        if (!ruleChain) {
            goState(this.router, 'home.ruleChains');
            return;
        }
    } else {
        const ruleChainId = this.route.snapshot.params['ruleChainId'];
        [ruleChain, ruleChainMetaData] = await Promise.all([
            this.ruleChainService.getRuleChain(ruleChainId),
            this.ruleChainService.getRuleChainMetaData(ruleChainId)
        ]);
    }
    const ruleNodeComponents: any = await this.ruleChainService.getRuleNodeComponents();
    this.ruleChain = ruleChain;
    this.ruleChainMetaData = ruleChainMetaData;
    this.ruleNodeComponents = ruleNodeComponents;
    this.loadRuleChainLibrary(ruleNodeComponents, true);
  }

  ngDoCheck(): void {
    const editing = !!(this.isEditingRuleNode || this.isEditingRuleNodeLink);
    if (editing !== this.lastEditing) {
        this.lastEditing = editing;
        this.enableHotKeys = !editing;
        this.updateErrorTooltips(editing);
    }
    if (this.watchedModel !== null) {
        const current = modelSnapshot(this.ruleChainModel);
        if (current !== this.watchedModel) {
            this.watchedModel = current;
            this.validate();
            if (!this.isDirty) {
                this.isDirty = true;
            }
        }
    }
  }

  ngOnDestroy(): void {
    this.searchSub();
    this.destroyTooltips();
    for (const nodeId in this.errorTooltips) {
        this.errorTooltips[nodeId].destroy();
    }
    this.errorTooltips = {};
  }

  setRuleNodeSearch(search: any): void {
    if (search !== this.ruleNodeSearch) {
        this.ruleNodeSearch = search;
        const res: any = filterByProperty(this.ruleNodeComponents, 'name', this.ruleNodeSearch);
        this.loadRuleChainLibrary(res);
    }
  }

  /** The legacy hotkeys (angular-hotkeys, allowed in inputs too). */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.enableHotKeys) {
        return;
    }
    const mod = event.ctrlKey || event.metaKey;
    const key = (event.key || '').toLowerCase();
    if (mod && key === 'a') {
        event.preventDefault();
        this.modelservice.selectAll();
    } else if (mod && key === 'c') {
        event.preventDefault();
        this.copyRuleNodes();
    } else if (mod && key === 'v') {
        event.preventDefault();
        if (this.itembuffer.hasRuleNodes()) {
            this.pasteRuleNodes();
        }
    } else if (key === 'escape') {
        event.preventDefault();
        event.stopPropagation();
        this.modelservice.deselectAll();
    } else if (mod && key === 's') {
        event.preventDefault();
        this.saveRuleChain();
    } else if (mod && key === 'z') {
        event.preventDefault();
        this.revertRuleChain();
    } else if (key === 'delete') {
        event.preventDefault();
        this.modelservice.deleteSelected();
    }
  }

  openRuleChainContextMenu = ($event: MouseEvent): void => {
    if (this.canvasControl.modelservice && !$event.ctrlKey && !$event.metaKey) {
        const x: number = $event.clientX;
        const y: number = $event.clientY;
        const item: any = this.canvasControl.modelservice.getItemInfoAtPoint(x, y);
        this.contextInfo = this.prepareContextMenu(item);
        if (this.contextInfo.items && this.contextInfo.items.length > 0) {
            $event.preventDefault();
            this.contextMenuEvent = $event;
            const anchor = this.contextMenuAnchor()?.nativeElement;
            if (anchor) {
                anchor.style.left = x + 'px';
                anchor.style.top = y + 'px';
            }
            this.contextMenuTrigger()?.openMenu();
        }
    }
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

  onEditRuleNodeClosed(...rest: any[]): any {
    this.editingRuleNode = null;
  }

  onEditRuleNodeLinkClosed(...rest: any[]): any {
    this.editingRuleNodeLink = null;
  }

  private setPristine(theForm?: any): void {
    if (theForm?.form?.markAsPristine) {
        theForm.form.markAsPristine();
    } else if (theForm?.markAsPristine) {
        theForm.markAsPristine();
    }
  }

  saveRuleNode(theForm?: any, ...rest: any[]): any {
    this.rootScope.$broadcast('form-submit');
    if (!theForm || theForm.valid !== false) {
        this.setPristine(theForm);
        if (this.editingRuleNode.error) {
            delete this.editingRuleNode.error;
        }
        this.ruleChainModel.nodes[this.editingRuleNodeIndex] = this.editingRuleNode;
        this.editingRuleNode = deepCopy(this.editingRuleNode);
        this.updateRuleNodesHighlight();
    }
  }

  saveRuleNodeLink(theForm?: any, ...rest: any[]): any {
    this.setPristine(theForm);
    this.ruleChainModel.edges[this.editingRuleNodeLinkIndex] = this.editingRuleNodeLink;
    this.editingRuleNodeLink = deepCopy(this.editingRuleNodeLink);
  }

  onRevertRuleNodeEdit(theForm?: any, ...rest: any[]): any {
    this.setPristine(theForm);
    var node: any = this.ruleChainModel.nodes[this.editingRuleNodeIndex];
    this.editingRuleNode = deepCopy(node);
  }

  onRevertRuleNodeLinkEdit(theForm?: any, ...rest: any[]): any {
    this.setPristine(theForm);
    var edge: any = this.ruleChainModel.edges[this.editingRuleNodeLinkIndex];
    this.editingRuleNodeLink = deepCopy(edge);
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
    const instances: any[] = ($ as any).tooltipster?.instances() ?? [];
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
        const element: any = $(event.target);
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
        const contentElement: any = $(content);
        const tooltip: any = element.tooltipster('instance');
        tooltip.content(contentElement);
        tooltip.open();
    }, 500);
  }

  updateNodeErrorTooltip(node?: any, ...rest: any[]): any {
    let tooltip: any = this.errorTooltips[node.id];
    if (node.error) {
        const element: any = $('#' + node.id);
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
            const contentElement: any = $(content);
            tooltip = element.tooltipster('instance');
            tooltip.isErrorTooltip = true;
            tooltip.content(contentElement);
            this.errorTooltips[node.id] = tooltip;
        }
        setTimeout(() => {
            tooltip.open();
        });
    } else {
        if (tooltip) {
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
        this.editingRuleNode = deepCopy(node);
        this.selectedRuleNodeTabIndex = 0;
        setTimeout(() => {
            this.setPristine(this.ruleNodeForm);
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
        this.editingRuleNodeLink = deepCopy(edge);
        setTimeout(() => {
            this.setPristine(this.ruleNodeLinkForm);
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
    const canvas: HTMLElement | null = this.canvasControl.modelservice?.getCanvasHtmlElement() ?? null;
    let x: any = 0, y: any = 0;
    if (canvas && event) {
        const offset = canvas.getBoundingClientRect();
        x = Math.round(event.clientX - offset.left);
        y = Math.round(event.clientY - offset.top);
    } else if (canvas?.parentElement) {
        const scrollParent: HTMLElement = canvas.parentElement;
        x = scrollParent.scrollLeft + scrollParent.clientWidth/2;
        y = scrollParent.scrollTop + scrollParent.clientHeight/2;
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
    let componentType: any;
    for (componentType in this.ruleNodeTypesModel) {
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
    for (const type in this.ruleNodeTypesModel) {
        this.libraryPanelExpanded[type] = this.ruleNodeTypesModel[type].model.nodes.length > 0;
    }
    setTimeout(() => {
        for (const componentType in this.ruleNodeTypesCanvasControl) {
            if (this.ruleNodeTypesCanvasControl[componentType].adjustCanvasSize) {
                this.ruleNodeTypesCanvasControl[componentType].adjustCanvasSize(true);
            }
        }
    });
  }

  prepareRuleChain(...rest: any[]): any {

    this.watchedModel = null;

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

    setTimeout(() => {
        this.watchedModel = modelSnapshot(this.ruleChainModel);
    });
  }

  updateRuleNodesHighlight(...rest: any[]): any {
    for (var i: any = 0; i < this.ruleChainModel.nodes.length; i++) {
        this.ruleChainModel.nodes[i].highlighted = false;
    }
    const searchText: any = this.rootScope['searchConfig']?.searchText;
    if (searchText) {
        var res: any = filterByProperty(this.ruleChainModel.nodes, 'name', searchText);
        if (res) {
            for (i = 0; i < res.length; i++) {
                res[i].highlighted = true;
            }
        }
    }
  }

  validate(...rest: any[]): any {
    setTimeout(() => {
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
            var res: any = this.ruleChainModel.edges.filter((e: any) => e.source === this.inputConnectorId);
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
                            var newRuleChainConnection: any = deepCopy(ruleChainConnection);
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
                            var newNodeConnection: any = deepCopy(nodeConnection);
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
                        setTimeout(() => {
                            goState(this.router, 'home.ruleChains.ruleChain', {ruleChainId: this.ruleChain.id.id});
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
    ruleNode.configuration = deepCopy(ruleNode.component.configurationDescriptor.nodeDefinition.defaultConfiguration);

    var ruleChainId: any = this.ruleChain.id ? this.ruleChain.id.id : null;

    this.enableHotKeys = false;

    firstValueFrom(this.dialog.open(AddRuleNodeComponent, {
        data: {ruleNode: ruleNode, ruleChainId: ruleChainId},
        panelClass: 'tb-dialog'
    }).afterClosed()).then((ruleNode?: any) => {
        if (!ruleNode) {
            this.enableHotKeys = true;
            return;
        }
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
    });
  }

  /** Resolves with the link, rejects when the dialog is cancelled (as `$mdDialog.show` did). */
  addRuleNodeLink($event?: any, link?: any, labels?: any, allowCustomLabels?: any, ...rest: any[]): Promise<any> {
    return firstValueFrom(this.dialog.open(AddRuleNodeLinkComponent, {
        data: {link: link, labels: labels, allowCustomLabels: allowCustomLabels},
        panelClass: 'tb-dialog'
    }).afterClosed()).then((result?: any) => result ? result : Promise.reject());
  }

  objectsSelected = (...rest: any[]): any => {
    return this.modelservice.nodes.getSelectedNodes().length > 0 ||
        this.modelservice.edges.getSelectedEdges().length > 0
  };

  deleteSelected = (...rest: any[]): any => {
    this.modelservice.deleteSelected();
  };

  isDebugModeEnabled = (...rest: any[]): any => {
    return this.ruleChainModel.nodes.some((node: any) => node.debugMode === true);
  };

  resetDebugModeInAllNodes = (...rest: any[]): any => {
    this.ruleChainModel.nodes.forEach((node?: any) => {
        if (node.component.type != this.typesRef.ruleNodeType.INPUT.value && node.component.type != this.typesRef.ruleNodeType.RULE_CHAIN.value) {
            node.debugMode = false;
        }
    });
  };

  triggerResize = (...rest: any[]): any => {
    window.dispatchEvent(new Event('resize'));
  };

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
