import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createComponent,
  DoCheck,
  ElementRef,
  EnvironmentInjector,
  inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  reflectComponentType,
  Type,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import $ from 'jquery';

import { AlarmService } from '../../api/services/alarm.service';
import { DashboardService } from '../../api/services/dashboard.service';
import { DatasourceService } from '../../api/services/datasource.service';
import { DeviceService } from '../../api/services/device.service';
import { EntityService } from '../../api/services/entity.service';
import { TimeService } from '../../api/services/time.service';
import { TbRafService } from '../../common/services/tb-raf.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { ToastService } from '../../services/toast.service';
import { TbLegendDirective } from '../tb-legend/tb-legend.directive';
import { RootState } from '../../../root-state';
import { goState } from '../../../state-paths';
import { $q, $timeout } from '../../../core/q';
import { createLegacyFilter, legacyCopy, legacyEquals } from './legacy-helpers';
import { createLegacyInjector } from './legacy-injector';
import { WidgetScope } from './widget-scope';
import { attrToInputName, WIDGET_DIRECTIVES } from './widget-directives';
import Subscription from '../../../legacy-lib/api/subscription';
import cssjs from '../../../../vendor/css.js/css';

/** The app events a widget reacts to, as the dashboard broadcast them down its scope. */
const FORWARDED_EVENTS = [
  'toggleDashboardEditMode',
  'mobileModeChanged',
  'dashboardTimewindowChanged',
  'entityAliasesChanged',
  'entityAliasResolved',
  'widgetForceReInit',
  'gridster-item-resized',
  'onWidgetFullscreenChanged',
];

/** A widget-type template that is one ported directive: rendered by `ngComponentOutlet`. */
interface DirectiveOutlet {
  type: Type<any>;
  /** input name → the widget-scope expression the template's attribute bound it to */
  bindings: Record<string, string>;
  inputs: Record<string, any>;
  mounted: boolean;
}

/** A ported directive inside a larger widget template: created on its own element. */
interface EmbeddedDirective {
  ref: ComponentRef<any>;
  bindings: Record<string, string>;
}

/**
 * The widget runtime: ported from `WidgetController` (src/app/components/widget/widget.controller.js).
 *
 * It builds the widget context (`self.ctx` of the widget type's controller script),
 * renders the widget type's HTML into the widget container, creates the default
 * subscription, and calls the widget type's lifecycle (`onInit`, `onDataUpdated`,
 * `onResize`, `onEditModeChanged`, `onMobileModeChanged`, `onDestroy`).
 * The template HTML is plain HTML (there is no template compiler at run time);
 * the directives the system widget types name (`<tb-knob ctx="ctx">` …) are the
 * ported components, rendered with `ngComponentOutlet` and bound to `ctx.$scope`.
 */
@Component({
  selector: 'widget',
  standalone: true,
  imports: [NgComponentOutlet, NgTemplateOutlet, MatProgressSpinnerModule, TbLegendDirective],
  templateUrl: './widget.component.html',
  host: { style: 'display: block; position: absolute; top: 0; left: 0; right: 0; bottom: 0;' },
})
export class WidgetComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  /** What `tb-widget` passed the controller: widget, dashboard, isEdit, isMobile, aliasController … */
  @Input() locals: any;
  @Input() widgetInfo: any;
  @Input() widgetType: any;

  protected readonly router = inject(Router);
  protected readonly element = inject(ElementRef);
  protected readonly injector = inject(Injector);
  protected readonly environmentInjector = inject(EnvironmentInjector);
  protected readonly appRef = inject(ApplicationRef);
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly zone = inject(NgZone);
  protected readonly sanitizer = inject(DomSanitizer);
  protected readonly translate = inject(TranslateService);
  protected readonly rootScope = inject(RootState);
  protected readonly utils = inject(UtilsService);
  protected readonly timeService = inject(TimeService);
  protected readonly datasourceService = inject(DatasourceService);
  protected readonly alarmService = inject(AlarmService);
  protected readonly entityService = inject(EntityService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly toast = inject(ToastService);
  protected readonly tbRaf: any = inject(TbRafService).$get(window, $timeout);

  isEdit: any;
  isMobile: any;
  dashboard: any;
  widget: any;
  aliasController: any;
  stateController: any;
  dashboardTimewindow: any;
  dashboardTimewindowApi: any;

  /** The controller's `$scope`: Subscription's `ctx.$scope`, the parent of the widget's own `ctx.$scope`. */
  controllerScope!: WidgetScope;
  typeParameters: any;
  loadingData: any = true;
  widgetErrorData: any = null;
  displayLegend: any = false;
  legendConfig: any;
  legendData: any;
  legendLayout = 'column';
  legendStyle = '';
  legendFirst = false;
  rendered = false;
  renderGeneration = 0;
  containerHtml: SafeHtml = '';
  directiveOutlet: DirectiveOutlet | null = null;

  protected cssParser: any = new cssjs();
  protected gridsterItemInited = false;
  protected subscriptionInited = false;
  protected widgetSizeDetected = false;
  protected cafs: any = {};
  protected actionDescriptorsBySourceId: any = {};
  protected widgetContext: any;
  protected subscriptionContext: any;
  protected widgetTypeInstance: any;
  protected embedded: EmbeddedDirective[] = [];
  protected resizeObserver: ResizeObserver | null = null;
  protected offRootEvents: (() => void)[] = [];
  protected widgetPositionKey = '';
  protected destroyed = false;

  ngOnInit(): void {
    const locals = this.locals || {};
    this.isEdit = locals.isEdit;
    this.isMobile = locals.isMobile;
    this.dashboard = locals.dashboard;
    this.widget = locals.widget;
    this.aliasController = locals.aliasController;
    this.stateController = locals.stateController;
    this.dashboardTimewindow = locals.dashboardTimewindow;
    this.dashboardTimewindowApi = locals.dashboardTimewindowApi;

    this.controllerScope = new WidgetScope(this.rootScope);
    this.controllerScope['$timeout'] = $timeout;
    this.controllerScope['$q'] = $q;
    this.controllerScope['$injector'] = createLegacyInjector(this.injector);
    this.controllerScope['tbRaf'] = this.tbRaf;
    this.controllerScope['rpcRejection'] = null;
    this.controllerScope['rpcErrorText'] = null;
    this.controllerScope['rpcEnabled'] = false;
    this.controllerScope['executingRpcRequest'] = false;
    this.forwardRootEvents();

    (window as any).cssjs = cssjs;
    this.cssParser.testMode = false;

    this.buildActionDescriptors();
    this.widgetContext = this.createWidgetContext();
    this.createHeaderActions();
    this.subscriptionContext = {
      $scope: this.controllerScope,
      $q: $q,
      $filter: createLegacyFilter((key, params) => this.translate.instant(key, params)),
      $timeout: $timeout,
      tbRaf: this.tbRaf,
      timeService: this.timeService,
      deviceService: this.deviceService,
      datasourceService: this.datasourceService,
      alarmService: this.alarmService,
      utils: this.utils,
      widgetUtils: this.widgetContext.utils,
      dashboardTimewindowApi: this.dashboardTimewindowApi,
      types: types,
      getStDiff: this.dashboardService.getServerTimeDiff,
      aliasController: this.aliasController,
    };
    this.widget.$ctx = () => this.widgetContext;

    this.typeParameters = this.widgetInfo.typeParameters;
    try {
      this.widgetTypeInstance = new this.widgetType(this.widgetContext);
    } catch (e: any) {
      this.handleWidgetException(e);
      this.widgetTypeInstance = {};
    }
    for (const fn of ['onInit', 'onDataUpdated', 'onResize', 'onEditModeChanged', 'onMobileModeChanged', 'onDestroy']) {
      if (!this.widgetTypeInstance[fn]) {
        this.widgetTypeInstance[fn] = function () {};
      }
    }
    this.widgetPositionKey = this.positionKey();
  }

  ngAfterViewInit(): void {
    this.initialize().then(
      () => this.onInit(),
      () => this.onInit(),
    );
    // The grid lays the item out with CSS: it is placed as soon as the view is (gridster-item-initialized).
    this.gridsterItemInitialized({ gridster: this.dashboard });
  }

  ngDoCheck(): void {
    if (!this.controllerScope) {
      return;
    }
    // AngularJS ran its watchers on every digest; Angular's change detection is the digest now.
    this.controllerScope.$digest();
    this.refreshDirectiveInputs();
    const key = this.positionKey();
    if (key !== this.widgetPositionKey) {
      this.widgetPositionKey = key;
      queueMicrotask(() => this.rootScope.$emit('widgetPositionChanged', this.widget));
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.offRootEvents.forEach((off) => off());
    this.offRootEvents = [];
    this.onDestroy();
    this.controllerScope.$destroy();
  }

  private positionKey(): string {
    return this.widget ? this.widget.row + ',' + this.widget.col + ',' + this.widget.config.mobileOrder : '';
  }

  /**
   * The dashboard sends its events through the app's root events with itself as the last
   * argument; a widget takes the ones from its own dashboard (and the ones no dashboard sent,
   * like the alias controller's), and passes them down its scopes as the dashboard scope did.
   */
  private forwardRootEvents(): void {
    for (const name of FORWARDED_EVENTS) {
      this.offRootEvents.push(
        this.rootScope.$on(name, (_event: any, ...args: any[]) => {
          const last = args.length ? args[args.length - 1] : null;
          if (last && typeof last === 'object' && typeof last.widgetLocals === 'function') {
            if (last !== this.dashboard) {
              return;
            }
            args = args.slice(0, -1);
          }
          this.controllerScope.$broadcast(name, ...args);
        }),
      );
    }
  }

  private buildActionDescriptors(): void {
    if (this.widget.config.actions) {
      for (const actionSourceId in this.widget.config.actions) {
        const descriptors: any = this.widget.config.actions[actionSourceId];
        const actionDescriptors: any = [];
        descriptors.forEach((descriptor: any) => {
          const actionDescriptor: any = legacyCopy(descriptor);
          actionDescriptor.displayName = this.utils.customTranslation(descriptor.name, descriptor.name);
          actionDescriptors.push(actionDescriptor);
        });
        this.actionDescriptorsBySourceId[actionSourceId] = actionDescriptors;
      }
    }
  }

  private createWidgetContext(): any {
    const context: any = {
      inited: false,
      $container: null,
      $containerParent: null,
      width: 0,
      height: 0,
      hideTitlePanel: false,
      isEdit: this.isEdit,
      isMobile: this.isMobile,
      dashboard: this.dashboard,
      widgetConfig: this.widget.config,
      settings: this.widget.config.settings,
      units: this.widget.config.units || '',
      decimals: this.widget.config.decimals !== undefined ? this.widget.config.decimals : 2,
      subscriptions: {},
      defaultSubscription: null,
      dashboardTimewindow: this.dashboardTimewindow,
      timewindowFunctions: {
        onUpdateTimewindow: (startTimeMs?: any, endTimeMs?: any, interval?: any) => {
          if (context.defaultSubscription) {
            context.defaultSubscription.onUpdateTimewindow(startTimeMs, endTimeMs, interval);
          }
        },
        onResetTimewindow: () => {
          if (context.defaultSubscription) {
            context.defaultSubscription.onResetTimewindow();
          }
        },
      },
      subscriptionApi: {
        createSubscription: (options?: any, subscribe?: any) => this.createSubscription(options, subscribe),
        createSubscriptionFromInfo: (type?: any, subscriptionsInfo?: any, options?: any, useDefaultComponents?: any, subscribe?: any) =>
          this.createSubscriptionFromInfo(type, subscriptionsInfo, options, useDefaultComponents, subscribe),
        removeSubscription: (id?: any) => {
          const subscription: any = context.subscriptions[id];
          if (subscription) {
            subscription.destroy();
            delete context.subscriptions[id];
          }
        },
      },
      controlApi: {
        sendOneWayCommand: (method?: any, params?: any, timeout?: any) =>
          context.defaultSubscription ? context.defaultSubscription.sendOneWayCommand(method, params, timeout) : null,
        sendTwoWayCommand: (method?: any, params?: any, timeout?: any) =>
          context.defaultSubscription ? context.defaultSubscription.sendTwoWayCommand(method, params, timeout) : null,
      },
      utils: {
        formatValue: this.formatValue,
      },
      actionsApi: {
        actionDescriptorsBySourceId: this.actionDescriptorsBySourceId,
        getActionDescriptors: this.getActionDescriptors,
        handleWidgetAction: this.handleWidgetAction,
        elementClick: this.elementClick,
        getActiveEntityInfo: this.getActiveEntityInfo,
      },
      stateController: this.stateController,
      aliasController: this.aliasController,
    };
    return context;
  }

  private createHeaderActions(): void {
    this.widgetContext.customHeaderActions = [];
    const headerActionsDescriptors = this.getActionDescriptors(types.widgetActionSources.headerButton.value);
    for (const descriptor of headerActionsDescriptors) {
      const headerAction: any = {
        name: descriptor.name,
        displayName: descriptor.displayName,
        icon: descriptor.icon,
        descriptor: descriptor,
      };
      headerAction.onAction = ($event?: any) => {
        const entityInfo: any = this.getActiveEntityInfo();
        const entityId: any = entityInfo ? entityInfo.entityId : null;
        const entityName: any = entityInfo ? entityInfo.entityName : null;
        const entityLabel: any = entityInfo && entityInfo.entityLabel ? entityInfo.entityLabel : null;
        this.handleWidgetAction($event, headerAction.descriptor, entityId, entityName, null, entityLabel);
      };
      this.widgetContext.customHeaderActions.push(headerAction);
    }
  }

  clearRpcError(): void {
    if (this.widgetContext.defaultSubscription) {
      this.widgetContext.defaultSubscription.clearRpcError();
    }
  }

  createSubscriptionFromInfo(type?: any, subscriptionsInfo?: any, options?: any, useDefaultComponents?: any, subscribe?: any): Promise<any> {
    const deferred: any = $q.defer();
    options.type = type;

    if (useDefaultComponents) {
      this.defaultComponentsOptions(options);
    } else {
      if (!options.timeWindowConfig) {
        options.useDashboardTimewindow = true;
      }
    }

    let createDatasourcesPromise: any;
    if (options.type == types.widgetType.alarm.value) {
      createDatasourcesPromise = this.entityService.createAlarmSourceFromSubscriptionInfo(subscriptionsInfo);
    } else {
      createDatasourcesPromise = this.entityService.createDatasourcesFromSubscriptionsInfo(subscriptionsInfo);
    }

    createDatasourcesPromise.then((result?: any) => {
      if (options.type == types.widgetType.alarm.value) {
        options.alarmSource = result;
      } else {
        options.datasources = result;
      }
      this.createSubscription(options, subscribe).then(
        (subscription?: any) => {
          if (useDefaultComponents) {
            this.defaultSubscriptionOptions(subscription, options);
          }
          deferred.resolve(subscription);
        },
        () => {
          deferred.reject();
        },
      );
    });
    return deferred.promise;
  }

  createSubscription(options?: any, subscribe?: any): Promise<any> {
    const deferred: any = $q.defer();
    options.dashboardTimewindow = this.dashboardTimewindow;
    new Subscription(this.subscriptionContext, options).then(
      (subscription?: any) => {
        this.widgetContext.subscriptions[subscription.id] = subscription;
        if (subscribe) {
          subscription.subscribe();
        }
        deferred.resolve(subscription);
      },
      () => {
        deferred.reject();
      },
    );
    return deferred.promise;
  }

  defaultComponentsOptions(options?: any): void {
    options.useDashboardTimewindow = this.widget.config.useDashboardTimewindow !== undefined ? this.widget.config.useDashboardTimewindow : true;

    options.displayTimewindow = this.widget.config.displayTimewindow !== undefined ? this.widget.config.displayTimewindow : !options.useDashboardTimewindow;

    options.timeWindowConfig = options.useDashboardTimewindow ? this.dashboardTimewindow : this.widget.config.timewindow;
    options.legendConfig = null;

    if (this.displayLegend) {
      options.legendConfig = this.legendConfig;
    }
    options.decimals = this.widgetContext.decimals;
    options.units = this.widgetContext.units;

    options.callbacks = {
      onDataUpdated: () => {
        if (this.displayWidgetInstance()) {
          this.widgetTypeInstance.onDataUpdated();
        }
      },
      onDataUpdateError: (_subscription?: any, e?: any) => {
        this.handleWidgetException(e);
      },
      dataLoading: (subscription?: any) => {
        if (this.loadingData !== subscription.loadingData) {
          this.loadingData = subscription.loadingData;
        }
      },
      legendDataUpdated: (_subscription?: any, apply?: any) => {
        if (apply) {
          this.controllerScope.$digest();
          this.cdr.markForCheck();
        }
      },
      timeWindowUpdated: (_subscription?: any, timeWindowConfig?: any) => {
        this.widget.config.timewindow = timeWindowConfig;
        this.controllerScope.$apply();
      },
    };
  }

  defaultSubscriptionOptions(subscription?: any, options?: any): void {
    if (!options.useDashboardTimewindow) {
      this.controllerScope.$watch(
        () => this.widget.config.timewindow,
        (newTimewindow: any, prevTimewindow: any) => {
          if (!legacyEquals(newTimewindow, prevTimewindow)) {
            subscription.updateTimewindowConfig(this.widget.config.timewindow);
          }
        },
      );
    }
    if (this.displayLegend) {
      this.legendData = subscription.legendData;
    }
  }

  createDefaultSubscription(): Promise<any> {
    let options: any;
    const deferred: any = $q.defer();
    if (this.widget.type !== types.widgetType.rpc.value && this.widget.type !== types.widgetType.static.value) {
      options = {
        type: this.widget.type,
        stateData: this.typeParameters.stateData,
        comparisonEnabled: this.widgetContext.settings.comparisonEnabled,
        timeForComparison: this.widgetContext.settings.timeForComparison,
      };
      if (this.widget.type == types.widgetType.alarm.value) {
        options.alarmSource = legacyCopy(this.widget.config.alarmSource);
        options.alarmSearchStatus = this.widget.config.alarmSearchStatus !== undefined ? this.widget.config.alarmSearchStatus : types.alarmSearchStatus.any;
        options.alarmsPollingInterval = this.widget.config.alarmsPollingInterval !== undefined ? this.widget.config.alarmsPollingInterval * 1000 : 5000;
        options.alarmsMaxCountLoad = this.widget.config.alarmsMaxCountLoad !== undefined ? this.widget.config.alarmsMaxCountLoad : 0;
        options.alarmsFetchSize = this.widget.config.alarmsFetchSize !== undefined ? this.widget.config.alarmsFetchSize : 100;
      } else {
        options.datasources = legacyCopy(this.widget.config.datasources);
      }

      this.defaultComponentsOptions(options);

      this.createSubscription(options).then(
        (subscription?: any) => {
          this.defaultSubscriptionOptions(subscription, options);

          // backward compatibility
          this.widgetContext.datasources = subscription.datasources;
          this.widgetContext.data = subscription.data;
          this.widgetContext.hiddenData = subscription.hiddenData;
          this.widgetContext.timeWindow = subscription.timeWindow;
          this.widgetContext.defaultSubscription = subscription;
          deferred.resolve();
        },
        () => {
          deferred.reject();
        },
      );
    } else if (this.widget.type === types.widgetType.rpc.value) {
      this.loadingData = false;
      options = {
        type: this.widget.type,
        targetDeviceAliasIds: this.widget.config.targetDeviceAliasIds,
      };
      options.callbacks = {
        rpcStateChanged: (subscription?: any) => {
          this.controllerScope['rpcEnabled'] = subscription.rpcEnabled;
          this.controllerScope['executingRpcRequest'] = subscription.executingRpcRequest;
        },
        onRpcSuccess: (subscription?: any) => {
          this.controllerScope['executingRpcRequest'] = subscription.executingRpcRequest;
          this.controllerScope['rpcErrorText'] = subscription.rpcErrorText;
          this.controllerScope['rpcRejection'] = subscription.rpcRejection;
        },
        onRpcFailed: (subscription?: any) => {
          this.controllerScope['executingRpcRequest'] = subscription.executingRpcRequest;
          this.controllerScope['rpcErrorText'] = subscription.rpcErrorText;
          this.controllerScope['rpcRejection'] = subscription.rpcRejection;
        },
        onRpcErrorCleared: () => {
          this.controllerScope['rpcErrorText'] = null;
          this.controllerScope['rpcRejection'] = null;
        },
      };
      this.createSubscription(options).then(
        (subscription?: any) => {
          this.widgetContext.defaultSubscription = subscription;
          deferred.resolve();
        },
        () => {
          deferred.reject();
        },
      );
    } else if (this.widget.type === types.widgetType.static.value) {
      this.loadingData = false;
      deferred.resolve();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  getActionDescriptors = (actionSourceId?: any): any => {
    return this.actionDescriptorsBySourceId[actionSourceId] || [];
  };

  elementClick = (event?: any): void => {
    const e: any = event.target || event.srcElement;
    if (e.id) {
      const descriptors: any = this.getActionDescriptors('elementClick');
      for (const descriptor of descriptors) {
        if (descriptor.name == e.id) {
          event.stopPropagation();
          const entityInfo: any = this.getActiveEntityInfo();
          const entityId: any = entityInfo ? entityInfo.entityId : null;
          const entityName: any = entityInfo ? entityInfo.entityName : null;
          const entityLabel: any = entityInfo && entityInfo.entityLabel ? entityInfo.entityLabel : null;
          this.handleWidgetAction(event, descriptor, entityId, entityName, null, entityLabel);
        }
      }
    }
  };

  updateEntityParams(params?: any, targetEntityParamName?: any, targetEntityId?: any, entityName?: any, entityLabel?: any): void {
    if (targetEntityId) {
      let targetEntityParams: any;
      if (targetEntityParamName && targetEntityParamName.length) {
        targetEntityParams = params[targetEntityParamName];
        if (!targetEntityParams) {
          targetEntityParams = {};
          params[targetEntityParamName] = targetEntityParams;
          params.targetEntityParamName = targetEntityParamName;
        }
      } else {
        targetEntityParams = params;
      }
      targetEntityParams.entityId = targetEntityId;
      if (entityName) {
        targetEntityParams.entityName = entityName;
      }
      if (entityLabel) {
        targetEntityParams.entityLabel = entityLabel;
      }
    }
  }

  /** `$state.current.name`: the `state` of the deepest active route. */
  private currentStateName(): string | undefined {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data ? route.data['state'] : undefined;
  }

  handleWidgetAction = ($event?: any, descriptor?: any, entityId?: any, entityName?: any, additionalParams?: any, entityLabel?: any): void => {
    const type: any = descriptor.type;
    const targetEntityParamName: any = descriptor.stateEntityParamName;
    let targetEntityId: any;
    if (descriptor.setEntityId) {
      targetEntityId = entityId;
    }
    switch (type) {
      case types.widgetActionTypes.openDashboardState.value:
      case types.widgetActionTypes.updateDashboardState.value: {
        const targetDashboardStateId: any = descriptor.targetDashboardStateId;
        let params: any = legacyCopy(this.widgetContext.stateController.getStateParams());
        if (!params) {
          params = {};
        }
        this.updateEntityParams(params, targetEntityParamName, targetEntityId, entityName, entityLabel);
        if (type == types.widgetActionTypes.openDashboardState.value) {
          this.widgetContext.stateController.openState(targetDashboardStateId, params, descriptor.openRightLayout);
        } else {
          this.widgetContext.stateController.updateState(targetDashboardStateId, params, descriptor.openRightLayout);
        }
        break;
      }
      case types.widgetActionTypes.openDashboard.value: {
        const targetDashboardId: any = descriptor.targetDashboardId;
        const targetDashboardStateId: any = descriptor.targetDashboardStateId;
        const stateObject: any = { params: {} };
        this.updateEntityParams(stateObject.params, targetEntityParamName, targetEntityId, entityName, entityLabel);
        if (targetDashboardStateId) {
          stateObject.id = targetDashboardStateId;
        }
        const stateParams: any = {
          dashboardId: targetDashboardId,
          state: this.utils.objToBase64([stateObject]),
        };
        if (this.currentStateName() === 'dashboard') {
          goState(this.router, 'dashboard', stateParams);
        } else {
          goState(this.router, 'home.dashboards.dashboard', stateParams);
        }
        break;
      }
      case types.widgetActionTypes.custom.value: {
        const customFunction: any = descriptor.customFunction;
        if (customFunction !== undefined && customFunction.length > 0) {
          try {
            if (!additionalParams) {
              additionalParams = {};
            }
            const customActionFunction: any = new Function('$event', 'widgetContext', 'entityId', 'entityName', 'additionalParams', customFunction);
            customActionFunction($event, this.widgetContext, entityId, entityName, additionalParams);
          } catch {
            // a failing custom action does not break the widget (legacy behaviour)
          }
        }
        break;
      }
      case types.widgetActionTypes.customPretty.value: {
        const customPrettyFunction: any = descriptor.customFunction;
        const customHtml: any = descriptor.customHtml;
        const customCss: any = descriptor.customCss;
        const customResources: any = descriptor.customResources;
        const actionNamespace: any = 'custom-action-pretty-' + descriptor.name.toLowerCase();
        let htmlTemplate: any = '';
        if (customHtml !== undefined && customHtml.length > 0) {
          htmlTemplate = customHtml;
        }
        this.loadCustomActionResources(actionNamespace, customCss, customResources).then(
          () => {
            if (customPrettyFunction !== undefined && customPrettyFunction.length > 0) {
              try {
                if (!additionalParams) {
                  additionalParams = {};
                }
                const customActionPrettyFunction: any = new Function('$event', 'widgetContext', 'entityId', 'entityName', 'htmlTemplate', 'additionalParams', customPrettyFunction);
                customActionPrettyFunction($event, this.widgetContext, entityId, entityName, htmlTemplate, additionalParams);
              } catch {
                // a failing custom action does not break the widget (legacy behaviour)
              }
            }
          },
          (errorMessages?: any) => {
            this.processResourcesLoadErrors(errorMessages);
          },
        );
        break;
      }
    }
  };

  loadCustomActionResources(actionNamespace?: any, customCss?: any, customResources?: any): Promise<any> {
    const deferred: any = $q.defer();

    if (customCss !== undefined && customCss.length > 0) {
      this.cssParser.cssPreviewNamespace = actionNamespace;
      this.cssParser.createStyleElement(actionNamespace, customCss, 'nonamespace');
    }

    const errors: string[] = [];
    // WidgetService puts the resource loader ($ocLazyLoad's replacement) on window.lazyLoad.
    const lazyLoad: any = (window as any).lazyLoad;
    const loadNextOrComplete = (i: number) => {
      i++;
      if (i < customResources.length) {
        loadNext(i);
      } else if (errors.length > 0) {
        deferred.reject(errors);
      } else {
        deferred.resolve();
      }
    };
    const loadNext = (i: number) => {
      const resourceUrl: any = customResources[i].url;
      if (resourceUrl && resourceUrl.length > 0) {
        lazyLoad.load(resourceUrl).then(
          () => loadNextOrComplete(i),
          () => {
            errors.push("Failed to load custom action resource: '" + resourceUrl + "'");
            loadNextOrComplete(i);
          },
        );
      } else {
        loadNextOrComplete(i);
      }
    };

    if (customResources !== undefined && customResources.length > 0) {
      loadNext(0);
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  processResourcesLoadErrors(errorMessages?: any): void {
    let messageToShow = '';
    for (const e in errorMessages) {
      messageToShow += '<div>' + errorMessages[e] + '</div>';
    }
    this.toast.showError(messageToShow);
  }

  getActiveEntityInfo = (): any => {
    let entityInfo: any = this.widgetContext.activeEntityInfo;
    if (!entityInfo) {
      for (const id in this.widgetContext.subscriptions) {
        const subscription: any = this.widgetContext.subscriptions[id];
        entityInfo = subscription.getFirstEntityInfo();
        if (entityInfo) {
          break;
        }
      }
    }
    return entityInfo;
  };

  /**
   * The widget type's template as one ported directive (`<tb-knob ctx="ctx"></tb-knob>`):
   * its component and the widget-scope expressions its attributes bind to the component's inputs.
   */
  private templateDirective(templateHtml: string): DirectiveOutlet | null {
    const tpl = document.createElement('template');
    tpl.innerHTML = templateHtml || '';
    const nodes = Array.from(tpl.content.childNodes).filter(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length),
    );
    if (nodes.length !== 1 || nodes[0].nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    const el = nodes[0] as Element;
    const type = WIDGET_DIRECTIVES[el.tagName.toLowerCase()];
    if (!type) {
      return null;
    }
    return { type, bindings: this.inputBindings(type, el), inputs: {}, mounted: false };
  }

  private inputBindings(type: Type<any>, el: Element): Record<string, string> {
    const inputs = new Set((reflectComponentType(type)?.inputs || []).map((i) => i.templateName));
    const bindings: Record<string, string> = {};
    for (const attr of Array.from(el.attributes)) {
      const name = attrToInputName(attr.name);
      if (inputs.has(name)) {
        bindings[name] = attr.value;
      }
    }
    return bindings;
  }

  /** The `translate` attribute of the template's text (`<div translate>widget.widget-type-not-found</div>`). */
  private translateStaticText(container: HTMLElement): void {
    container.querySelectorAll('[translate]').forEach((el) => {
      const key = (el.textContent || '').trim();
      if (key) {
        el.textContent = this.translate.instant(key);
      }
    });
  }

  configureWidgetElement(): void {
    this.displayLegend = this.widget.config.showLegend !== undefined ? this.widget.config.showLegend : this.widget.type === types.widgetType.timeseries.value;

    if (this.displayLegend) {
      this.legendConfig = this.widget.config.legendConfig || {
        position: types.position.bottom.value,
        showMin: false,
        showMax: false,
        showAvg: this.widget.type === types.widgetType.timeseries.value,
        showTotal: false,
      };
      this.legendData = {
        keys: [],
        data: [],
      };
      const position = this.legendConfig.position;
      this.legendLayout = position === types.position.top.value || position === types.position.bottom.value ? 'column' : 'row';
      switch (position) {
        case types.position.top.value:
          this.legendStyle = 'padding-bottom: 8px; max-height: 50%; overflow-y: auto;';
          break;
        case types.position.bottom.value:
          this.legendStyle = 'padding-top: 8px; max-height: 50%; overflow-y: auto;';
          break;
        case types.position.left.value:
          this.legendStyle = 'padding-right: 0px; max-width: 50%; overflow-y: auto;';
          break;
        case types.position.right.value:
          this.legendStyle = 'padding-left: 0px; max-width: 50%; overflow-y: auto;';
          break;
      }
      this.legendFirst = position === types.position.top.value || position === types.position.left.value;
    }

    const templateHtml: string = this.widgetInfo.templateHtml || '';
    this.directiveOutlet = this.templateDirective(templateHtml);
    // The widget type's own template: trusted content of the widget type, as $compile took it.
    this.containerHtml = this.directiveOutlet ? '' : this.sanitizer.bypassSecurityTrustHtml(templateHtml);
    this.rendered = true;
    this.renderGeneration++;
    this.cdr.detectChanges();

    const host: HTMLElement = this.element.nativeElement;
    const containerParent: HTMLElement = this.displayLegend ? host.querySelector('#widget-container') : host;
    const container: HTMLElement = containerParent.querySelector(':scope > #container');
    if (!this.directiveOutlet) {
      this.translateStaticText(container);
    }
    this.widgetContext.$container = $(container);
    this.widgetContext.$containerParent = $(containerParent);

    if (this.widgetSizeDetected) {
      this.widgetContext.$container.css('height', this.widgetContext.height + 'px');
      this.widgetContext.$container.css('width', this.widgetContext.width + 'px');
    }

    this.widgetContext.$scope = this.controllerScope.$new();

    this.resizeObserver = new ResizeObserver(() => this.zone.run(() => this.onResize()));
    this.resizeObserver.observe(containerParent);
  }

  destroyWidgetElement(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.unmountWidgetDirectives();
    this.rendered = false;
    this.directiveOutlet = null;
    this.containerHtml = '';
    if (!this.destroyed) {
      this.cdr.detectChanges();
    }
    if (this.widgetContext.$scope) {
      this.widgetContext.$scope.$destroy();
    }
    this.widgetContext.$container = null;
    this.widgetContext.$containerParent = null;
  }

  /**
   * After the widget type's `onInit` (which puts `ctx`, `tableId` … on `ctx.$scope`), the
   * ported directives of its template are created and bound to those values.
   */
  private mountWidgetDirectives(): void {
    const widgetScope: WidgetScope = this.widgetContext.$scope;
    if (this.directiveOutlet) {
      this.directiveOutlet.inputs = this.evalBindings(widgetScope, this.directiveOutlet.bindings);
      this.directiveOutlet.mounted = true;
      this.cdr.detectChanges();
      return;
    }
    const container: HTMLElement = this.widgetContext.$container ? this.widgetContext.$container[0] : null;
    if (!container) {
      return;
    }
    for (const tag of Object.keys(WIDGET_DIRECTIVES)) {
      container.querySelectorAll(tag).forEach((el) => {
        const type = WIDGET_DIRECTIVES[tag];
        const bindings = this.inputBindings(type, el);
        const ref = createComponent(type, {
          environmentInjector: this.environmentInjector,
          elementInjector: this.injector,
          hostElement: el,
        });
        const values = this.evalBindings(widgetScope, bindings);
        for (const name of Object.keys(values)) {
          ref.setInput(name, values[name]);
        }
        this.appRef.attachView(ref.hostView);
        ref.changeDetectorRef.detectChanges();
        this.embedded.push({ ref, bindings });
      });
    }
  }

  private unmountWidgetDirectives(): void {
    for (const e of this.embedded) {
      this.appRef.detachView(e.ref.hostView);
      e.ref.destroy();
    }
    this.embedded = [];
    if (this.directiveOutlet) {
      this.directiveOutlet.mounted = false;
    }
  }

  private evalBindings(widgetScope: WidgetScope, bindings: Record<string, string>): Record<string, any> {
    const values: Record<string, any> = {};
    for (const name of Object.keys(bindings)) {
      values[name] = widgetScope ? widgetScope.$eval(bindings[name]) : undefined;
    }
    return values;
  }

  /** The directives' inputs follow the widget scope values, as their bindings did. */
  private refreshDirectiveInputs(): void {
    const widgetScope: WidgetScope = this.widgetContext ? this.widgetContext.$scope : null;
    if (!widgetScope) {
      return;
    }
    if (this.directiveOutlet && this.directiveOutlet.mounted) {
      const values = this.evalBindings(widgetScope, this.directiveOutlet.bindings);
      Object.assign(this.directiveOutlet.inputs, values);
    }
    for (const e of this.embedded) {
      const values = this.evalBindings(widgetScope, e.bindings);
      for (const name of Object.keys(values)) {
        e.ref.setInput(name, values[name]);
      }
    }
  }

  initialize(): Promise<any> {
    this.controllerScope.$on('toggleDashboardEditMode', (_event: any, isEdit: any) => {
      this.onEditModeChanged(isEdit);
    });

    this.controllerScope.$on('gridster-item-resized', (_event: any, item: any) => {
      if (!this.widgetContext.isMobile) {
        this.widget.sizeX = item.sizeX;
        this.widget.sizeY = item.sizeY;
      }
    });

    this.controllerScope.$on('mobileModeChanged', (_event: any, newIsMobile: any) => {
      this.onMobileModeChanged(newIsMobile);
    });

    this.controllerScope.$on('entityAliasesChanged', (_event: any, aliasIds: any) => {
      let subscriptionChanged = false;
      for (const id in this.widgetContext.subscriptions) {
        const subscription: any = this.widgetContext.subscriptions[id];
        subscriptionChanged = subscriptionChanged || subscription.onAliasesChanged(aliasIds);
      }
      if (subscriptionChanged && !this.typeParameters.useCustomDatasources) {
        this.reInit();
      }
    });

    this.controllerScope.$on('dashboardTimewindowChanged', (_event: any, newDashboardTimewindow: any) => {
      this.dashboardTimewindow = newDashboardTimewindow;
      this.widgetContext.dashboardTimewindow = newDashboardTimewindow;
    });

    this.controllerScope.$on('widgetForceReInit', () => {
      this.reInit();
    });

    this.configureWidgetElement();
    const deferred: any = $q.defer();
    if (!this.typeParameters.useCustomDatasources) {
      this.createDefaultSubscription().then(
        () => {
          this.subscriptionInited = true;
          deferred.resolve();
        },
        () => {
          this.subscriptionInited = true;
          deferred.reject();
        },
      );
    } else {
      this.loadingData = false;
      this.subscriptionInited = true;
      deferred.resolve();
    }
    return deferred.promise;
  }

  reInit(): void {
    this.onDestroy();
    this.configureWidgetElement();
    if (!this.typeParameters.useCustomDatasources) {
      this.createDefaultSubscription().then(
        () => {
          this.subscriptionInited = true;
          this.onInit();
        },
        () => {
          this.subscriptionInited = true;
          this.onInit();
        },
      );
    } else {
      this.subscriptionInited = true;
      this.onInit();
    }
  }

  handleWidgetException(e?: any): void {
    console.error(e);
    try {
      this.widgetErrorData = this.utils.processWidgetException(e);
    } catch {
      this.widgetErrorData = this.utils.parseException(e, -5);
    }
  }

  isReady(): boolean {
    return this.subscriptionInited && this.gridsterItemInited && this.widgetSizeDetected;
  }

  onInit(skipSizeCheck?: any): void {
    if (this.destroyed || !this.widgetContext.$containerParent) {
      return;
    }
    if (!skipSizeCheck) {
      this.checkSize();
    }
    if (!this.widgetContext.inited && this.isReady()) {
      this.widgetContext.inited = true;
      try {
        if (this.displayWidgetInstance()) {
          this.widgetTypeInstance.onInit();
        } else {
          this.loadingData = false;
        }
      } catch (e: any) {
        this.handleWidgetException(e);
      }
      try {
        this.mountWidgetDirectives();
      } catch (e: any) {
        this.handleWidgetException(e);
      }
      if (!this.typeParameters.useCustomDatasources && this.widgetContext.defaultSubscription) {
        this.widgetContext.defaultSubscription.subscribe();
      }
    }
  }

  checkSize(): boolean {
    const width: any = this.widgetContext.$containerParent.width();
    const height: any = this.widgetContext.$containerParent.height();
    let sizeChanged = false;

    if (!this.widgetContext.width || this.widgetContext.width != width || !this.widgetContext.height || this.widgetContext.height != height) {
      if (width > 0 && height > 0) {
        this.widgetContext.$container.css('height', height + 'px');
        this.widgetContext.$container.css('width', width + 'px');
        this.widgetContext.width = width;
        this.widgetContext.height = height;
        sizeChanged = true;
        this.widgetSizeDetected = true;
      }
    }
    return sizeChanged;
  }

  /** Runs `fn` on the next animation frame, cancelling the one still pending under `key`. */
  private scheduleFrame(key: string, fn: () => void): void {
    if (this.cafs[key]) {
      this.cafs[key]();
      this.cafs[key] = null;
    }
    this.cafs[key] = this.tbRaf(() => {
      try {
        if (this.displayWidgetInstance()) {
          fn();
        }
      } catch (e: any) {
        this.handleWidgetException(e);
      }
    });
  }

  onResize = (): void => {
    if (!this.widgetContext.$containerParent) {
      return;
    }
    if (this.checkSize()) {
      if (this.widgetContext.inited) {
        this.scheduleFrame('resize', () => this.widgetTypeInstance.onResize());
      } else {
        this.onInit(true);
      }
    }
  };

  gridsterItemInitialized = (item?: any): void => {
    if (item && item.gridster) {
      this.gridsterItemInited = true;
      this.onInit();
    }
  };

  onEditModeChanged(isEdit?: any): void {
    if (this.widgetContext.isEdit != isEdit) {
      this.widgetContext.isEdit = isEdit;
      if (this.widgetContext.inited) {
        this.scheduleFrame('editMode', () => this.widgetTypeInstance.onEditModeChanged());
      }
    }
  }

  onMobileModeChanged(isMobile?: any): void {
    if (this.widgetContext.isMobile != isMobile) {
      this.widgetContext.isMobile = isMobile;
      if (this.widgetContext.inited) {
        this.scheduleFrame('mobileMode', () => this.widgetTypeInstance.onMobileModeChanged());
      }
    }
  }

  isNumeric(val?: any): boolean {
    return val - parseFloat(val) + 1 >= 0;
  }

  formatValue = (value?: any, dec?: any, units?: any, showZeroDecimals?: any): any => {
    if (value !== undefined && value !== null && this.isNumeric(value)) {
      let formatted: any = Number(value);
      if (dec !== undefined) {
        formatted = formatted.toFixed(dec);
      }
      if (!showZeroDecimals) {
        formatted = formatted * 1;
      }
      formatted = formatted.toString();
      if (units !== undefined && units.length > 0) {
        formatted += ' ' + units;
      }
      return formatted;
    }
    return value;
  };

  displayWidgetInstance(): boolean {
    if (this.widget.type !== types.widgetType.static.value) {
      for (const id in this.widgetContext.subscriptions) {
        if (this.widgetContext.subscriptions[id].isDataResolved()) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  onDestroy(): void {
    const shouldDestroyWidgetInstance = this.displayWidgetInstance();
    for (const id in this.widgetContext.subscriptions) {
      this.widgetContext.subscriptions[id].destroy();
    }
    this.subscriptionInited = false;
    this.widgetContext.subscriptions = {};
    if (this.widgetContext.inited) {
      this.widgetContext.inited = false;
      for (const cafId in this.cafs) {
        if (this.cafs[cafId]) {
          this.cafs[cafId]();
          this.cafs[cafId] = null;
        }
      }
      try {
        if (shouldDestroyWidgetInstance) {
          this.widgetTypeInstance.onDestroy();
        }
      } catch (e: any) {
        this.handleWidgetException(e);
      }
    }
    this.destroyWidgetElement();
  }
}
