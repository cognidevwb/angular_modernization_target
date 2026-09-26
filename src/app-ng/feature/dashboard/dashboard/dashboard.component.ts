import { Component, DoCheck, forwardRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { DashboardService } from '../../api/services/dashboard.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { ItembufferService } from '../../services/itembuffer.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { TimeService } from '../../api/services/time.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { UtilsService } from '../../common/services/utils.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbExpandFullscreenDirective } from '../../components/tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbDashboardToolbarDirective } from '../tb-dashboard-toolbar/tb-dashboard-toolbar.directive';
import { TbUserMenuDirective } from '../../layout/tb-user-menu/tb-user-menu.directive';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbAliasesEntitySelectDirective } from '../../entity/tb-aliases-entity-select/tb-aliases-entity-select.directive';
import { TbDashboardSelectDirective } from '../../components/tb-dashboard-select/tb-dashboard-select.directive';
import { TbStatesComponentDirective } from '../tb-states-component/tb-states-component.directive';
import { TbDashboardLayoutDirective } from '../tb-dashboard-layout/tb-dashboard-layout.directive';
import { TbDetailsSidenavDirective } from '../../components/tb-details-sidenav/tb-details-sidenav.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbEditWidgetDirective } from '../tb-edit-widget/tb-edit-widget.directive';
import { TbWidgetsBundleSelectDirective } from '../../components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive';
import { TbDashboardDirective } from '../../components/tb-dashboard/tb-dashboard.directive';

import { NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { EntityAliasesComponent } from '../../entity/entity-aliases/entity-aliases.component';
import { DashboardSettingsComponent } from '../dashboard-settings/dashboard-settings.component';
import { ManageDashboardLayoutsComponent } from '../manage-dashboard-layouts/manage-dashboard-layouts.component';
import { ManageDashboardStatesComponent } from '../manage-dashboard-states/manage-dashboard-states.component';
import { AddWidgetComponent } from '../add-widget/add-widget.component';
import { SelectTargetLayoutComponent } from '../select-target-layout/select-target-layout.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import AliasController from '../../../../app/api/alias-controller';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
import { THINGSBOARD_VERSION } from '../../../app-globals';
import { goState } from '../../../state-paths';
import { createLegacyFilter, legacyCopy, legacyEquals } from '../../components/widget/legacy-helpers';
import { notifyWidgetEditor } from '../widget-editor-frame';

/** `$mdMedia('gt-sm')`. */
const GT_SM = '(min-width: 960px)';

/**
 * The legacy `vm.widgetForm` as the widget details panel and `tb-edit-widget` read it
 * (`$dirty`, `$invalid`, `$setPristine()`): dirty while the edited widget or its layout differs
 * from the copy taken when it was last made pristine, or once a child marks it dirty.
 */
class WidgetFormState {
  private pristineWidget: any = null;
  private pristineLayout: any = null;
  private forcedDirty = false;
  /** The Angular form around the editor, when rendered: its own validity counts too. */
  ngForm: NgForm | null = null;

  constructor(private readonly host: { editingWidget: any; editingWidgetLayout: any }) {}

  get $dirty(): boolean {
    return this.forcedDirty || !!this.ngForm?.dirty ||
      !legacyEquals(this.host.editingWidget, this.pristineWidget) ||
      !legacyEquals(this.host.editingWidgetLayout, this.pristineLayout);
  }

  get $pristine(): boolean {
    return !this.$dirty;
  }

  get $invalid(): boolean {
    return !!this.ngForm?.invalid;
  }

  get $valid(): boolean {
    return !this.$invalid;
  }

  $setDirty(): void {
    this.forcedDirty = true;
  }

  $setPristine(): void {
    this.forcedDirty = false;
    this.pristineWidget = legacyCopy(this.host.editingWidget);
    this.pristineLayout = legacyCopy(this.host.editingWidgetLayout);
    this.ngForm?.form.markAsPristine();
  }
}

/**
 * Ported from the AngularJS controller `DashboardController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * The dashboard page: loads the dashboard, shows its state's layouts, the toolbar, edit mode,
 * the add/edit widget panels and the dashboard dialogs.
 */
@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatTabsModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbDashboardToolbarDirective), forwardRef(() => TbUserMenuDirective), forwardRef(() => TbTimewindowDirective), forwardRef(() => TbAliasesEntitySelectDirective), forwardRef(() => TbDashboardSelectDirective), forwardRef(() => TbStatesComponentDirective), forwardRef(() => TbDashboardLayoutDirective), forwardRef(() => TbDetailsSidenavDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbEditWidgetDirective), forwardRef(() => TbWidgetsBundleSelectDirective), forwardRef(() => TbDashboardDirective)],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements DoCheck {
  protected readonly utils = inject(UtilsService);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly widgetService = inject(WidgetService);
  protected readonly userService = inject(UserService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly timeService = inject(TimeService);
  protected readonly entityService = inject(EntityService);
  protected readonly itembuffer = inject(ItembufferService);
  protected readonly importExport = inject(ImportExportService);
  protected readonly rootScope = inject(RootState);
  protected readonly element = inject(ElementRef);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly dialog = inject(MatDialog);
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly destroyRef = inject(DestroyRef);
  /** `$filter` for the alias controller (it orders resolved datasources with `orderBy`). */
  protected readonly $filter = createLegacyFilter((key, params) => this.translate.instant(key, params));

  user: any;
  dashboard: any = null;
  editingWidget: any = null;
  editingWidgetLayout: any = null;
  editingWidgetOriginal: any = null;
  editingWidgetLayoutOriginal: any = null;
  editingWidgetSubtitle: any = null;
  forceDashboardMobileMode: any = false;
  isAddingWidget: any = false;
  isEdit: any = false;
  isEditingWidget: any = false;
  latestWidgetTypes: any = [];
  timeseriesWidgetTypes: any = [];
  rpcWidgetTypes: any = [];
  alarmWidgetTypes: any = [];
  staticWidgetTypes: any = [];
  widgetEditMode: any;
  iframeMode: any;
  isToolbarOpened: any = false;
  thingsboardVersion: any = THINGSBOARD_VERSION;
  currentDashboardId: any;
  layouts: any = {
        main: {
            show: false,
            layoutCtx: {
                id: 'main',
                widgets: [],
                widgetLayouts: {},
                gridSettings: {},
                ignoreLoading: false
            }
        },
        right: {
            show: false,
            layoutCtx: {
                id: 'right',
                widgets: [],
                widgetLayouts: {},
                gridSettings: {},
                ignoreLoading: false
            }
        }
    };
  isRightLayoutOpened: any = false;
  isMobile: any;
  dashboardCtx: any;
  addingLayoutCtx: any;
  configurationError: any;
  currentCustomerId: any;
  currentDashboardScope: any;
  dashboardConfiguration: any;
  editingLayoutCtx: any;
  prevDashboard: any;
  widgetsBundle: any;
  /** The add-widget speed dial (md-fab-speed-dial) is open. */
  fabOpen = false;
  /** `vm.widgetForm`: the widget details form as the legacy panels read it. */
  readonly widgetForm = new WidgetFormState(this);

  @ViewChild('widgetNgForm')
  set widgetNgForm(form: NgForm | undefined) {
    this.widgetForm.ngForm = form ?? null;
  }

  constructor() {
    this.user = this.userService.getCurrentUser();
    this.widgetEditMode = this.route.snapshot.data['widgetEditMode'];
    this.iframeMode = this.rootScope['iframeMode'];
    this.currentDashboardId = this.route.snapshot.params['dashboardId'];
    if (this.route.snapshot.params['customerId']) {
        this.currentCustomerId = this.route.snapshot.params['customerId'];
        this.currentDashboardScope = 'customer';
    } else {
        this.currentDashboardScope = this.user.authority === 'TENANT_ADMIN' ? 'tenant' : 'customer';
        this.currentCustomerId = this.user.customerId;
    }
    this.isMobile = !this.breakpoints.isMatched(GT_SM);
    const gtSm = this.breakpoints.observe(GT_SM).subscribe((state) => {
        this.isMobile = !state.matches;
    });
    this.dashboardCtx = {
        state: null,
        stateController: {
            openRightLayout: () => {
                this.openRightLayout();
            }
        },
        onAddWidget: (event?: any, layoutCtx?: any) => {
            this.addWidget(event, layoutCtx);
        },
        onEditWidget: (event?: any, layoutCtx?: any, widget?: any) => {
            this.editWidget(event, layoutCtx, widget);
        },
        onExportWidget: (event?: any, layoutCtx?: any, widget?: any) => {
            this.exportWidget(event, layoutCtx, widget);
        },
        onWidgetMouseDown: (event?: any, layoutCtx?: any, widget?: any) => {
            this.widgetMouseDown(event, layoutCtx, widget);
        },
        onWidgetClicked: (event?: any, layoutCtx?: any, widget?: any) => {
            this.widgetClicked(event, layoutCtx, widget);
        },
        prepareDashboardContextMenu: (layoutCtx?: any) => {
            return this.prepareDashboardContextMenu(layoutCtx);
        },
        prepareWidgetContextMenu: (layoutCtx?: any, widget?: any) => {
            return this.prepareWidgetContextMenu(layoutCtx, widget);
        },
        onRemoveWidget: (event?: any, layoutCtx?: any, widget?: any) => {
            this.removeWidget(event, layoutCtx, widget);
        },
        copyWidget: ($event?: any, layoutCtx?: any, widget?: any) => {
            this.copyWidget($event, layoutCtx, widget);
        },
        copyWidgetReference: ($event?: any, layoutCtx?: any, widget?: any) => {
            this.copyWidgetReference($event, layoutCtx, widget);
        },
        pasteWidget: ($event?: any, layoutCtx?: any, pos?: any) => {
            this.pasteWidget($event, layoutCtx, pos);
        },
        pasteWidgetReference: ($event?: any, layoutCtx?: any, pos?: any) => {
            this.pasteWidgetReference($event, layoutCtx, pos);
        }
    };
    this.watch(() => this.widgetsBundle, (newVal?: any, prevVal?: any) => {
        if (newVal !== prevVal && !this.widgetEditMode) {
            this.loadWidgetLibrary();
        }
    });
    this.watch(() => this.currentDashboardId, (newVal?: any, prevVal?: any) => {
        if (newVal !== prevVal && !this.widgetEditMode) {
            if (this.currentDashboardScope === 'customer' && this.user.authority === 'TENANT_ADMIN') {
                goState(this.router, 'home.customers.dashboards.dashboard', {
                    customerId: this.currentCustomerId,
                    dashboardId: this.currentDashboardId
                });
            } else {
                if (this.currentStateName() === 'dashboard') {
                    goState(this.router, 'dashboard', {dashboardId: this.currentDashboardId});
                } else {
                    goState(this.router, 'home.dashboards.dashboard', {dashboardId: this.currentDashboardId});
                }
            }
        }
    });
    // ui-router made a new controller for another dashboard; the Router keeps this component: load it here
    const params = this.route.paramMap.subscribe((paramMap) => {
        const dashboardId = paramMap.get('dashboardId');
        if (this.dashboard && dashboardId && this.dashboard.id && this.dashboard.id.id !== dashboardId) {
            this.currentDashboardId = dashboardId;
            this.setEditMode(false, false);
            this.onEditWidgetClosed();
            this.isAddingWidget = false;
            this.dashboard = null;
            this.loadDashboard();
        }
    });
    this.destroyRef.onDestroy(() => {
        gtSm.unsubscribe();
        params.unsubscribe();
        if (this.dashboardCtx.stateController.cleanupPreservedStates) {
            this.dashboardCtx.stateController.cleanupPreservedStates();
        }
    });
    this.loadDashboard();
  }

  /** The toolbar is shown open (`vm.toolbarOpened`). */
  get toolbarOpened(): boolean {
    return !this.widgetEditMode &&
        (this.toolbarAlwaysOpen() || this.isToolbarOpened || this.isEdit || this.showRightLayoutSwitch());
  }

  set toolbarOpened(_value: boolean) {
    // read-only, as the legacy property
  }

  /** The right layout is shown (`vm.rightLayoutOpened`): always beside the main one, on mobile when switched to. */
  get rightLayoutOpened(): boolean {
    return !this.isMobile || this.isRightLayoutOpened;
  }

  /** `$state.current.name`: the ui-router state of this route. */
  private currentStateName(): string | undefined {
    return this.route.snapshot.data['state'];
  }

  /** The AliasController the page creates broadcasts its alias changes here (`$scope.$broadcast`). */
  $broadcast(name: string, ...args: any[]): void {
    this.rootScope.$broadcast(name, ...args);
  }

  private createAliasController(): any {
    return new AliasController(this, $q, this.$filter, this.utils,
        types, this.entityService, this.dashboardCtx.stateController, this.dashboardConfiguration.entityAliases);
  }

  /** `$mdDialog.show({…, locals})`: resolves with what the dialog closed with, rejects when it was dismissed. */
  private showDialog(component: any, data?: any): Promise<any> {
    const ref = this.dialog.open(component, { data: data, autoFocus: false });
    return firstValueFrom(ref.afterClosed()).then((result) => (result === undefined ? Promise.reject() : result));
  }

  openToolbar(...rest: any[]): any {
    setTimeout(() => {
        this.isToolbarOpened = true;
    });
  }

  closeToolbar(...rest: any[]): any {
    setTimeout(() => {
        this.isToolbarOpened = false;
    });
  }

  showCloseToolbar(...rest: any[]): any {
    return !this.toolbarAlwaysOpen() && !this.isEdit && !this.showRightLayoutSwitch();
  }

  showRightLayoutSwitch(...rest: any[]): any {
    return this.isMobile && this.layouts.right.show;
  }

  toggleLayouts(...rest: any[]): any {
    this.isRightLayoutOpened = !this.isRightLayoutOpened;
  }

  openRightLayout(...rest: any[]): any {
    this.isRightLayoutOpened = true;
  }

  mainLayoutWidth(...rest: any[]): any {
    if (this.isEditingWidget && this.editingLayoutCtx.id === 'main') {
        return '100%';
    } else {
        return this.layouts.right.show && !this.isMobile ? '50%' : '100%';
    }
    return undefined;
  }

  mainLayoutHeight(...rest: any[]): any {
    if (!this.isEditingWidget || this.editingLayoutCtx.id === 'main') {
        return '100%';
    } else {
        return '0px';
    }
    return undefined;
  }

  rightLayoutWidth(...rest: any[]): any {
    if (this.isEditingWidget && this.editingLayoutCtx.id === 'right') {
        return '100%';
    } else {
        return this.isMobile ? '100%' : '50%';
    }
    return undefined;
  }

  rightLayoutHeight(...rest: any[]): any {
    if (!this.isEditingWidget || this.editingLayoutCtx.id === 'right') {
        return '100%';
    } else {
        return '0px';
    }
    return undefined;
  }

  loadWidgetLibrary(...rest: any[]): any {
    this.latestWidgetTypes = [];
    this.timeseriesWidgetTypes = [];
    this.rpcWidgetTypes = [];
    this.alarmWidgetTypes = [];
    this.staticWidgetTypes = [];
    if (this.widgetsBundle) {
        var bundleAlias: any = this.widgetsBundle.alias;
        var isSystem: any = this.widgetsBundle.tenantId.id === types.id.nullUid;

        this.widgetService.getBundleWidgetTypes(bundleAlias, isSystem).then(
            (widgetTypes?: any) => {
                const loadNext = (i?: any): any => {
                    var widgetType: any = widgetTypes[i];
                    var widgetTypeInfo: any = this.widgetService.toWidgetInfo(widgetType);
                    var widget: any = {
                        isSystemType: isSystem,
                        bundleAlias: bundleAlias,
                        typeAlias: widgetTypeInfo.alias,
                        type: widgetTypeInfo.type,
                        title: widgetTypeInfo.widgetName,
                        sizeX: widgetTypeInfo.sizeX,
                        sizeY: widgetTypeInfo.sizeY,
                        row: top,
                        col: 0,
                        config: JSON.parse(widgetTypeInfo.defaultConfig)
                    };
                    widget.config.title = widgetTypeInfo.widgetName;
                    if (widgetTypeInfo.type === types.widgetType.timeseries.value) {
                        this.timeseriesWidgetTypes.push(widget);
                    } else if (widgetTypeInfo.type === types.widgetType.latest.value) {
                        this.latestWidgetTypes.push(widget);
                    } else if (widgetTypeInfo.type === types.widgetType.rpc.value) {
                        this.rpcWidgetTypes.push(widget);
                    } else if (widgetTypeInfo.type === types.widgetType.alarm.value) {
                        this.alarmWidgetTypes.push(widget);
                    } else if (widgetTypeInfo.type === types.widgetType.static.value) {
                        this.staticWidgetTypes.push(widget);
                    }
                    top += widget.sizeY;
                    loadNextOrComplete(i);

                }

                widgetTypes = [...widgetTypes].sort((a: any, b: any) => (b.createdTime ?? 0) - (a.createdTime ?? 0));

                var top: any = 0;

                if (widgetTypes.length > 0) {
                    loadNext(0);
                }

                function loadNextOrComplete(i?: any): any {
                    i++;
                    if (i < widgetTypes.length) {
                        loadNext(i);
                    }
                }


            }
        );
    }
  }

  loadDashboard(): void {
    if (this.widgetEditMode) {
        const editWidgetInfo: any = this.rootScope['editWidgetInfo'];
        var widget: any = {
            isSystemType: true,
            bundleAlias: 'customWidgetBundle',
            typeAlias: 'customWidget',
            type: editWidgetInfo.type,
            title: 'My widget',
            sizeX: editWidgetInfo.sizeX * 2,
            sizeY: editWidgetInfo.sizeY * 2,
            row: 2,
            col: 4,
            config: JSON.parse(editWidgetInfo.defaultConfig)
        };
        widget.config.title = widget.config.title || editWidgetInfo.widgetName;

        this.dashboard = this.dashboardUtils.createSingleWidgetDashboard(widget);
        this.dashboardConfiguration = this.dashboard.configuration;
        this.dashboardCtx.dashboard = this.dashboard;
        this.dashboardCtx.dashboardTimewindow = this.dashboardConfiguration.timewindow;
        this.dashboardCtx.aliasController = this.createAliasController();
        notifyWidgetEditor('widgetEditModeInited');
    } else {
        this.dashboardService.getDashboard(this.currentDashboardId)
            .then((dashboard?: any) => {
                this.dashboard = this.dashboardUtils.validateAndUpdateDashboard(dashboard);
                this.dashboardConfiguration = this.dashboard.configuration;
                this.dashboardCtx.dashboard = this.dashboard;
                this.dashboardCtx.dashboardTimewindow = this.dashboardConfiguration.timewindow;
                this.dashboardCtx.aliasController = this.createAliasController();
            }, () => {
                this.configurationError = true;
            });
    }
  }

  openDashboardState = (state?: any, openRightLayout?: any, ...rest: any[]): any => {
    const updateLayouts = (layoutVisibilityChanged?: any): any => {
        for (const l in this.layouts) {
            const layout: any = this.layouts[l];
            if (layoutsData[l]) {
                var layoutInfo: any = layoutsData[l];
                if (layout.layoutCtx.id === 'main') {
                    layout.layoutCtx.ctrl.setResizing(layoutVisibilityChanged);
                }
                this.updateLayout(layout, layoutInfo.widgets, layoutInfo.widgetLayouts, layoutInfo.gridSettings);
            } else {
                this.updateLayout(layout, [], {}, null);
            }
        }
    }
    var layoutsData: any = this.dashboardUtils.getStateLayoutsData(this.dashboard, state);
    if (layoutsData) {
        this.dashboardCtx.state = state;
        this.dashboardCtx.aliasController.dashboardStateChanged();
        var layoutVisibilityChanged: any = false;
        for (var l in this.layouts) {
            var layout: any = this.layouts[l];
            var showLayout: any;
            if (layoutsData[l]) {
                showLayout = true;
            } else {
                showLayout = false;
            }
            if (layout.show != showLayout) {
                layout.show = showLayout;
                layoutVisibilityChanged = !this.isMobile;
            }
        }
        this.isRightLayoutOpened = openRightLayout ? true : false;
        updateLayouts(layoutVisibilityChanged);
    }


  };

  updateLayout(layout?: any, widgets?: any, widgetLayouts?: any, gridSettings?: any, ...rest: any[]): any {
    if (gridSettings) {
        layout.layoutCtx.gridSettings = gridSettings;
    }
    layout.layoutCtx.widgets = widgets;
    layout.layoutCtx.widgetLayouts = widgetLayouts;
    if (layout.show && layout.layoutCtx.ctrl) {
        layout.layoutCtx.ctrl.reload();
    }
    layout.layoutCtx.ignoreLoading = true;
  }

  isPublicUser = (...rest: any[]): any => {
    return this.user.isPublic === true;
  };

  isTenantAdmin = (...rest: any[]): any => {
    return this.user.authority === 'TENANT_ADMIN';
  };

  isSystemAdmin = (...rest: any[]): any => {
    return this.user.authority === 'SYS_ADMIN';
  };

  dashboardConfigurationError = (...rest: any[]): any => {
    return this.configurationError;
  };

  showDashboardToolbar = (...rest: any[]): any => {
    return true;
  };

  openEntityAliases = ($event?: any, ...rest: any[]): any => {
    this.showDialog(EntityAliasesComponent, {
        config: {
            entityAliases: legacyCopy(this.dashboard.configuration.entityAliases),
            widgets: this.dashboardUtils.getWidgetsArray(this.dashboard),
            isSingleEntityAlias: false,
            singleEntityAlias: null
        }
    }).then((entityAliases?: any) => {
        this.dashboard.configuration.entityAliases = entityAliases;
        this.entityAliasesUpdated();
    }, () => {});
  };

  openDashboardSettings = ($event?: any, ...rest: any[]): any => {
    var gridSettings: any = null;
    var layoutKeys: any = this.dashboardUtils.isSingleLayoutDashboard(this.dashboard);
    if (layoutKeys) {
        gridSettings = legacyCopy(this.dashboard.configuration.states[layoutKeys.state].layouts[layoutKeys.layout].gridSettings);
    }
    this.showDialog(DashboardSettingsComponent, {
        settings: legacyCopy(this.dashboard.configuration.settings),
        gridSettings: gridSettings
    }).then((data?: any) => {
        this.dashboard.configuration.settings = data.settings;
        var gridSettings: any = data.gridSettings;
        if (gridSettings) {
            this.updateLayoutGrid(layoutKeys, gridSettings);
        }
    }, () => {});
  };

  manageDashboardLayouts = ($event?: any, ...rest: any[]): any => {
    this.showDialog(ManageDashboardLayoutsComponent, {
        layouts: legacyCopy(this.dashboard.configuration.states[this.dashboardCtx.state].layouts)
    }).then((layouts?: any) => {
        this.updateLayouts(layouts);
    }, () => {});
  };

  manageDashboardStates = ($event?: any, ...rest: any[]): any => {
    var dashboardConfiguration: any = this.dashboard.configuration;
    var states: any = legacyCopy(dashboardConfiguration.states);
    this.showDialog(ManageDashboardStatesComponent, {
        states: states
    }).then((states?: any) => {
        this.updateStates(states);
    }, () => {});
  };

  updateLayoutGrid(layoutKeys?: any, gridSettings?: any, ...rest: any[]): any {
    var layout: any = this.dashboard.configuration.states[layoutKeys.state].layouts[layoutKeys.layout];
    var layoutCtx: any = this.layouts[layoutKeys.layout];
    layoutCtx.widgets = [];
    this.dashboardUtils.updateLayoutSettings(layout, gridSettings);
    var layoutsData: any = this.dashboardUtils.getStateLayoutsData(this.dashboard, layoutKeys.state);
    layoutCtx.widgets = layoutsData[layoutKeys.layout].widgets;
  }

  updateLayouts(layouts?: any, ...rest: any[]): any {
    this.dashboardUtils.setLayouts(this.dashboard, this.dashboardCtx.state, layouts);
    this.openDashboardState(this.dashboardCtx.state);
  }

  updateStates(states?: any, ...rest: any[]): any {
    this.dashboard.configuration.states = states;
    this.dashboardUtils.removeUnusedWidgets(this.dashboard);
    var targetState: any = this.dashboardCtx.state;
    if (!this.dashboard.configuration.states[targetState]) {
        targetState = this.dashboardUtils.getRootStateId(this.dashboardConfiguration.states);
    }
    this.openDashboardState(targetState);
  }

  editWidget($event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    $event.stopPropagation();
    if (this.editingWidgetOriginal === widget) {
        this.onEditWidgetClosed();
    } else {
        var transition: any = !this.forceDashboardMobileMode;
        this.editingWidgetOriginal = widget;
        this.editingWidgetLayoutOriginal = layoutCtx.widgetLayouts[widget.id];
        this.editingWidget = legacyCopy(this.editingWidgetOriginal);
        this.editingWidgetLayout = legacyCopy(this.editingWidgetLayoutOriginal);
        this.widgetForm.$setPristine();
        this.editingLayoutCtx = layoutCtx;
        this.editingWidgetSubtitle = this.widgetService.getInstantWidgetInfo(this.editingWidget).widgetName;
        this.forceDashboardMobileMode = true;
        this.isEditingWidget = true;
        if (layoutCtx) {
            var delayOffset: any = transition ? 350 : 0;
            var delay: any = transition ? 400 : 300;
            setTimeout(() => {
                layoutCtx.ctrl.highlightWidget(this.editingWidgetOriginal, delay);
            }, delayOffset);
        }
    }
  }

  exportDashboard = ($event?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.exportDashboard(this.currentDashboardId);
  };

  exportWidget($event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    $event.stopPropagation();
    this.importExport.exportWidget(this.dashboard, this.dashboardCtx.state, layoutCtx.id, widget);
  }

  importWidget = ($event?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.importWidget($event, this.dashboard, this.dashboardCtx.state,
        this.selectTargetLayout, this.entityAliasesUpdated).then(
        (importData?: any) => {
            var widget: any = importData.widget;
            var layoutId: any = importData.layoutId;
            this.layouts[layoutId].layoutCtx.widgets.push(widget);
        }
    );
  };

  widgetMouseDown($event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    if (this.isEdit && !this.isEditingWidget) {
        layoutCtx.ctrl.selectWidget(widget, 0);
    }
  }

  widgetClicked($event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    if (this.isEditingWidget) {
        this.editWidget($event, layoutCtx, widget);
    }
  }

  prepareDashboardContextMenu(layoutCtx?: any, ...rest: any[]): any {
    var dashboardContextActions: any = [];
    if (this.isEdit && !this.isEditingWidget && !this.widgetEditMode) {
        dashboardContextActions.push(
            {
                action: this.openDashboardSettings,
                enabled: true,
                value: "dashboard.settings",
                icon: "settings"
            }
        );
        dashboardContextActions.push(
            {
                action: this.openEntityAliases,
                enabled: true,
                value: "entity.aliases",
                icon: "devices_other"
            }
        );
        dashboardContextActions.push(
            {
                action: ($event?: any, ...rest: any[]) => {
                    layoutCtx.ctrl.pasteWidget($event);
                },
                enabled: this.itembuffer.hasWidget(),
                value: "action.paste",
                icon: "content_paste",
                shortcut: "M-V"
            }
        );
        dashboardContextActions.push(
            {
                action: ($event?: any, ...rest: any[]) => {
                    layoutCtx.ctrl.pasteWidgetReference($event);
                },
                enabled: this.itembuffer.canPasteWidgetReference(this.dashboard, this.dashboardCtx.state, layoutCtx.id),
                value: "action.paste-reference",
                icon: "content_paste",
                shortcut: "M-I"
            }
        );

    }
    return dashboardContextActions;
  }

  prepareWidgetContextMenu(layoutCtx?: any, ...rest: any[]): any {
    var widgetContextActions: any = [];
    if (this.isEdit && !this.isEditingWidget) {
        widgetContextActions.push(
            {
                action: (event?: any, widget?: any, ...rest: any[]) => {
                    this.editWidget(event, layoutCtx, widget);
                },
                enabled: true,
                value: "action.edit",
                icon: "edit"
            }
        );
        if (!this.widgetEditMode) {
            widgetContextActions.push(
                {
                    action: (event?: any, widget?: any, ...rest: any[]) => {
                        this.copyWidget(event, layoutCtx, widget);
                    },
                    enabled: true,
                    value: "action.copy",
                    icon: "content_copy",
                    shortcut: "M-C"
                }
            );
            widgetContextActions.push(
                {
                    action: (event?: any, widget?: any, ...rest: any[]) => {
                        this.copyWidgetReference(event, layoutCtx, widget);
                    },
                    enabled: true,
                    value: "action.copy-reference",
                    icon: "content_copy",
                    shortcut: "M-R"
                }
            );
            widgetContextActions.push(
                {
                    action: (event?: any, widget?: any, ...rest: any[]) => {
                        this.removeWidget(event, layoutCtx, widget);
                    },
                    enabled: true,
                    value: "action.delete",
                    icon: "clear",
                    shortcut: "M-X"
                }
            );
        }
    }
    return widgetContextActions;
  }

  copyWidget($event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    this.itembuffer.copyWidget(this.dashboard, this.dashboardCtx.state, layoutCtx.id, widget);
  }

  copyWidgetReference($event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    this.itembuffer.copyWidgetReference(this.dashboard, this.dashboardCtx.state, layoutCtx.id, widget);
  }

  helpLinkIdForWidgetType = (...rest: any[]): any => {
    var link: any = 'widgetsConfig';
    if (this.editingWidget && this.editingWidget.type) {
        switch (this.editingWidget.type) {
            case types.widgetType.timeseries.value: {
                link = 'widgetsConfigTimeseries';
                break;
            }
            case types.widgetType.latest.value: {
                link = 'widgetsConfigLatest';
                break;
            }
            case types.widgetType.rpc.value: {
                link = 'widgetsConfigRpc';
                break;
            }
            case types.widgetType.alarm.value: {
                link = 'widgetsConfigAlarm';
                break;
            }
            case types.widgetType.static.value: {
                link = 'widgetsConfigStatic';
                break;
            }
        }
    }
    return link;
  };

  toolbarAlwaysOpen = (...rest: any[]): any => {
    if (this.dashboard && this.dashboard.configuration.settings &&
        (this.dashboard.configuration.settings.toolbarAlwaysOpen !== undefined)) {
        return this.dashboard.configuration.settings.toolbarAlwaysOpen;
    } else {
        return true;
    }
    return undefined;
  };

  displayTitle = (...rest: any[]): any => {
    if (this.dashboard && this.dashboard.configuration.settings &&
        (this.dashboard.configuration.settings.showTitle !== undefined)) {
        return this.dashboard.configuration.settings.showTitle;
    } else {
        return false;
    }
    return undefined;
  };

  displayExport = (...rest: any[]): any => {
    if (this.dashboard && this.dashboard.configuration.settings &&
        (this.dashboard.configuration.settings.showDashboardExport !== undefined)) {
        return this.dashboard.configuration.settings.showDashboardExport;
    } else {
        return true;
    }
    return undefined;
  };

  displayDashboardTimewindow = (...rest: any[]): any => {
    if (this.dashboard && this.dashboard.configuration.settings &&
        (this.dashboard.configuration.settings.showDashboardTimewindow !== undefined)) {
        return this.dashboard.configuration.settings.showDashboardTimewindow;
    } else {
        return true;
    }
    return undefined;
  };

  displayDashboardsSelect = (...rest: any[]): any => {
    if (this.dashboard && this.dashboard.configuration.settings &&
        (this.dashboard.configuration.settings.showDashboardsSelect !== undefined)) {
        return this.dashboard.configuration.settings.showDashboardsSelect;
    } else {
        return true;
    }
    return undefined;
  };

  displayEntitiesSelect = (...rest: any[]): any => {
    if (this.dashboard && this.dashboard.configuration.settings &&
        (this.dashboard.configuration.settings.showEntitiesSelect !== undefined)) {
        return this.dashboard.configuration.settings.showEntitiesSelect;
    } else {
        return true;
    }
    return undefined;
  };

  hideFullscreenButton = (...rest: any[]): any => {
    return this.widgetEditMode || this.iframeMode || this.rootScope['forceFullscreen'] || this.currentStateName() === 'dashboard';
  };

  onRevertWidgetEdit = (widgetForm?: any, ...rest: any[]): any => {
    if (widgetForm.$dirty) {
        widgetForm.$setPristine();
        this.editingWidget = legacyCopy(this.editingWidgetOriginal);
        this.editingWidgetLayout = legacyCopy(this.editingWidgetLayoutOriginal);
        widgetForm.$setPristine();
    }
  };

  saveWidget = (widgetForm?: any, ...rest: any[]): any => {
    var widget: any = legacyCopy(this.editingWidget);
    var widgetLayout: any = legacyCopy(this.editingWidgetLayout);
    var id: any = this.editingWidgetOriginal.id;
    var index: any = this.editingLayoutCtx.widgets.indexOf(this.editingWidgetOriginal);
    this.dashboardConfiguration.widgets[id] = widget;
    this.editingWidgetOriginal = widget;
    this.editingWidgetLayoutOriginal = widgetLayout;
    this.editingLayoutCtx.widgets[index] = widget;
    this.editingLayoutCtx.widgetLayouts[widget.id] = widgetLayout;
    this.editingLayoutCtx.ctrl.highlightWidget(this.editingWidgetOriginal, 0);
    widgetForm.$setPristine();
  };

  onEditWidgetClosed = (...rest: any[]): any => {
    this.editingWidgetOriginal = null;
    this.editingWidget = null;
    this.editingWidgetLayoutOriginal = null;
    this.editingWidgetLayout = null;
    this.editingLayoutCtx = null;
    this.editingWidgetSubtitle = null;
    this.isEditingWidget = false;
    this.resetHighlight();
    this.forceDashboardMobileMode = false;
  };

  addWidget = (event?: any, layoutCtx?: any, ...rest: any[]): any => {
    this.loadWidgetLibrary();
    this.isAddingWidget = true;
    this.addingLayoutCtx = layoutCtx;
  };

  onAddWidgetClosed = (...rest: any[]): any => {
    this.timeseriesWidgetTypes = [];
    this.latestWidgetTypes = [];
    this.rpcWidgetTypes = [];
    this.alarmWidgetTypes = [];
    this.staticWidgetTypes = [];
  };

  selectTargetLayout = ($event?: any, ...rest: any[]): Promise<any> => {
    var layouts: any = this.dashboardConfiguration.states[this.dashboardCtx.state].layouts;
    var layoutIds: any = Object.keys(layouts);
    if (layoutIds.length > 1) {
        return this.showDialog(SelectTargetLayoutComponent);
    }
    return $q.resolve(layoutIds[0]);
  };

  addWidgetFromType = (event?: any, widget?: any, ...rest: any[]): any => {
    this.onAddWidgetClosed();
    this.isAddingWidget = false;
    this.widgetService.getWidgetInfo(widget.bundleAlias, widget.typeAlias, widget.isSystemType).then(
        (widgetTypeInfo?: any) => {
            var config: any = JSON.parse(widgetTypeInfo.defaultConfig);
            config.title = 'New ' + widgetTypeInfo.widgetName;
            config.datasources = [];
            var newWidget: any = {
                isSystemType: widget.isSystemType,
                bundleAlias: widget.bundleAlias,
                typeAlias: widgetTypeInfo.alias,
                type: widgetTypeInfo.type,
                title: 'New widget',
                sizeX: widgetTypeInfo.sizeX,
                sizeY: widgetTypeInfo.sizeY,
                config: config
            };

            const addWidgetToLayout = (widget?: any, layoutId?: any): any => {
                this.dashboardUtils.addWidgetToLayout(this.dashboard, this.dashboardCtx.state, layoutId, widget);
                this.layouts[layoutId].layoutCtx.widgets.push(widget);
            }

            const addWidget = (widget?: any): any => {
                if (this.addingLayoutCtx) {
                    addWidgetToLayout(widget, this.addingLayoutCtx.id);
                    this.addingLayoutCtx = null;
                } else {
                    this.selectTargetLayout(event).then(
                        (layoutId?: any) => {
                            addWidgetToLayout(widget, layoutId);
                        }
                    );
                }
            }

            if (widgetTypeInfo.typeParameters.useCustomDatasources) {
                addWidget(newWidget);
            } else {
                const ref = this.dialog.open(AddWidgetComponent, {
                    data: {
                        dashboard: this.dashboard,
                        aliasController: this.dashboardCtx.aliasController,
                        widget: newWidget,
                        widgetInfo: widgetTypeInfo
                    },
                    autoFocus: false
                });
                // onComplete: the widget config inside lays itself out on a window resize
                ref.afterOpened().subscribe(() => window.dispatchEvent(new Event('resize')));
                firstValueFrom(ref.afterClosed()).then((result?: any) => {
                    if (result) {
                        addWidget(result.widget);
                    }
                });
            }
        }
    );
  };

  removeWidget(event?: any, layoutCtx?: any, widget?: any, ...rest: any[]): any {
    var title: any = widget.config.title;
    if (!title || title.length === 0) {
        title = this.widgetService.getInstantWidgetInfo(widget).widgetName;
    }
    showConfirm(this.dialog, {
        title: this.translate.instant('widget.remove-widget-title', {widgetTitle: title}),
        htmlContent: this.translate.instant('widget.remove-widget-text'),
        cancel: this.translate.instant('action.no'),
        ok: this.translate.instant('action.yes')
    }).then(() => {
        var index: any = layoutCtx.widgets.indexOf(widget);
        if (index > -1) {
            layoutCtx.widgets.splice(index, 1);
            this.dashboardUtils.removeWidgetFromLayout(this.dashboard, this.dashboardCtx.state, layoutCtx.id, widget.id);
        }
    }, () => {});
  }

  pasteWidget(event?: any, layoutCtx?: any, pos?: any, ...rest: any[]): any {
    this.itembuffer.pasteWidget(this.dashboard, this.dashboardCtx.state, layoutCtx.id, pos, this.entityAliasesUpdated).then(
        function (widget?: any) {
            if (widget) {
                layoutCtx.widgets.push(widget);
            }
        }
    );
  }

  pasteWidgetReference(event?: any, layoutCtx?: any, pos?: any, ...rest: any[]): any {
    this.itembuffer.pasteWidgetReference(this.dashboard, this.dashboardCtx.state, layoutCtx.id, pos).then(
        function (widget?: any) {
            if (widget) {
                layoutCtx.widgets.push(widget);
            }
        }
    );
  }

  setEditMode(isEdit?: any, revert?: any, ...rest: any[]): any {
    this.isEdit = isEdit;
    if (this.isEdit) {
        this.dashboardCtx.stateController.preserveState();
        this.prevDashboard = legacyCopy(this.dashboard);
    } else {
        if (this.widgetEditMode) {
            if (revert) {
                this.dashboard = this.prevDashboard;
            }
        } else {
            this.resetHighlight();
            if (revert) {
                this.dashboard = this.prevDashboard;
                this.dashboardConfiguration = this.dashboard.configuration;
                this.dashboardCtx.dashboardTimewindow = this.dashboardConfiguration.timewindow;
                this.entityAliasesUpdated();
            } else {
                this.dashboard.configuration.timewindow = this.dashboardCtx.dashboardTimewindow;
            }
        }
    }
  }

  resetHighlight(...rest: any[]): any {
    for (var l in this.layouts) {
        if (this.layouts[l].layoutCtx) {
            if (this.layouts[l].layoutCtx.ctrl) {
                this.layouts[l].layoutCtx.ctrl.resetHighlight();
            }
        }
    }
  }

  toggleDashboardEditMode = (...rest: any[]): any => {
    this.setEditMode(!this.isEdit, true);
  };

  saveDashboard = (...rest: any[]): any => {
    this.setEditMode(false, false);
    this.notifyDashboardUpdated();
  };

  entityAliasesUpdated = (...rest: any[]): any => {
    this.dashboardCtx.aliasController.updateEntityAliases(this.dashboard.configuration.entityAliases);
  };

  notifyDashboardUpdated(...rest: any[]): any {
    if (this.widgetEditMode) {
        var widget: any = this.layouts.main.layoutCtx.widgets[0];
        var layout: any = this.layouts.main.layoutCtx.widgetLayouts[widget.id];
        widget.sizeX = layout.sizeX;
        widget.sizeY = layout.sizeY;
        notifyWidgetEditor('widgetEditUpdated', widget);
    } else {
        this.dashboardService.saveDashboard(this.dashboard);
    }
  }

  /** The page's `$scope.$watch`es, run on every change detection (the digest). */
  private _watchers: Array<{ expr: () => any; prev: any; cb: (n: any, p: any) => void }> = [];

  private watch(expr: () => any, cb: (n: any, p: any) => void): void {
    this._watchers.push({ expr, prev: expr(), cb });
  }

  ngDoCheck(): void {
    for (const w of this._watchers) {
      const newVal = w.expr();
      if (newVal !== w.prev) {
        const prevVal = w.prev;
        w.prev = newVal;
        w.cb(newVal, prevVal);
      }
    }
  }
}
