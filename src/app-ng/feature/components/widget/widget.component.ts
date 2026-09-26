import { Component, inject, Injector, Input } from '@angular/core';
import { AlarmService } from '../../api/services/alarm.service';
import { DashboardService } from '../../api/services/dashboard.service';
import { DatasourceService } from '../../api/services/datasource.service';
import { DestroyRef } from '@angular/core';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { Router } from '@angular/router';
import { TbRafService } from '../../common/services/tb-raf.service';
import { TimeService } from '../../api/services/time.service';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import $ from 'jquery';
import Subscription from '../../../../app/api/subscription';
import cssjs from '../../../../vendor/css.js/css';

import { $q, $timeout } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let addResizeListener: any;
declare let angular: any;
declare let removeResizeListener: any;
declare let $compile: any;
declare let $filter: any;
declare let $injector: any;
declare let $ocLazyLoad: any;
declare let $scope: any;
declare let $window: any;
declare let aliasController: any;
declare let dashboard: any;
declare let dashboardTimewindow: any;
declare let dashboardTimewindowApi: any;
declare let isEdit: any;
declare let isMobile: any;
declare let stateController: any;
declare let widget: any;
declare let widgetInfo: any;
declare let widgetType: any;

/**
 * Ported from the AngularJS controller `WidgetController` (module `thingsboard.directives.widget`) in src/app/components/widget/widget.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 9 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'widget',
  standalone: true,
  template: '', // TODO(port): this controller's screen template is the templateUrl of its route in the legacy router
})
export class WidgetComponent {
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly router = inject(Router);
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  // TODO(port): '$ocLazyLoad' — an AngularJS built-in with no Angular counterpart
  protected readonly element = inject(ElementRef);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$injector' — inject() at the use site
  // TODO(port): '$filter' — inject the pipe class and call transform()
  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly tbRafRef = inject(TbRafService);
  protected readonly utilsRef = inject(UtilsService);
  protected readonly timeService = inject(TimeService);
  protected readonly datasourceService = inject(DatasourceService);
  protected readonly alarmService = inject(AlarmService);
  protected readonly entityService = inject(EntityService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly deviceService = inject(DeviceService);
  // TODO(port): 'isEdit' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): 'isMobile' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  // TODO(port): 'dashboardTimewindow' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  @Input() dashboardTimewindowApi: any;
  @Input() dashboard: any;
  @Input() widget: any;
  @Input() aliasController: any;
  @Input() stateController: any;
  @Input() widgetInfo: any;
  @Input() widgetType: any;
  @Input() isEdit: any;
  @Input() isMobile: any;
  @Input() dashboardTimewindow: any;
  protected readonly toast = inject(ToastService);
  protected readonly destroyRef = inject(DestroyRef);

  $timeout: any = $timeout;
  $q: any = $q;
  $injector: any = inject(Injector);
  tbRaf: any;
  rpcRejection: any = null;
  rpcErrorText: any = null;
  rpcEnabled: any = false;
  executingRpcRequest: any = false;
  protected cssParser: any = new cssjs();
  protected gridsterItemInited: any = false;
  protected subscriptionInited: any = false;
  protected widgetSizeDetected: any = false;
  protected cafs: any = {};
  protected actionDescriptorsBySourceId: any = {};
  protected widgetContext: any;
  protected headerActionsDescriptors: any;
  protected subscriptionContext: any;
  protected widgetTypeInstance: any;
  typeParameters: any = this.widgetInfo.typeParameters;
  descriptor: any;
  displayLegend: any;
  legendConfig: any;
  legendData: any;
  loadingData: any;
  widgetErrorData: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $scope.$apply — $apply is not needed: Angular detects the change
  // TODO(port): $scope.$digest — $digest is not needed: Angular detects the change
  // TODO(port): $scope.$emit — a scope event: call the service that listens
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): $state.current — $state.current: this.router.url, or the ActivatedRoute snapshot
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    let vm = this;
    this.tbRaf = this.tbRafRef;
    (window as any).lazyLoad = { load: () => Promise.resolve() };
    (window as any).cssjs = cssjs;
    this.cssParser.testMode = false;
    if (this.widget.config.actions) {
        for (var actionSourceId in this.widget.config.actions) {
            var descriptors: any = this.widget.config.actions[actionSourceId];
            var actionDescriptors: any = [];
            descriptors.forEach((descriptor?: any) => {
                var actionDescriptor: any = structuredClone(descriptor);
                actionDescriptor.displayName = this.utilsRef.customTranslation(descriptor.name, descriptor.name);
                actionDescriptors.push(actionDescriptor);
            });
            this.actionDescriptorsBySourceId[actionSourceId] = actionDescriptors;
        }
    }
    this.widgetContext = {
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
        decimals: (this.widget.config.decimals !== undefined) ? this.widget.config.decimals : 2,
        subscriptions: {},
        defaultSubscription: null,
        dashboardTimewindow: this.dashboardTimewindow,
        timewindowFunctions: {
            onUpdateTimewindow: (startTimeMs?: any, endTimeMs?: any, interval?: any, ...rest: any[]) => {
                if (this.widgetContext.defaultSubscription) {
                    this.widgetContext.defaultSubscription.onUpdateTimewindow(startTimeMs, endTimeMs, interval);
                }
            },
            onResetTimewindow: (...rest: any[]) => {
                if (this.widgetContext.defaultSubscription) {
                    this.widgetContext.defaultSubscription.onResetTimewindow();
                }
            }
        },
        subscriptionApi: {
            createSubscription: (options?: any, subscribe?: any, ...rest: any[]) => {
                return this.createSubscription(options, subscribe);
            },
            createSubscriptionFromInfo: (type?: any, subscriptionsInfo?: any, options?: any, useDefaultComponents?: any, subscribe?: any, ...rest: any[]) => {
                return this.createSubscriptionFromInfo(type, subscriptionsInfo, options, useDefaultComponents, subscribe);
            },
            removeSubscription: (id?: any, ...rest: any[]) => {
                var subscription: any = this.widgetContext.subscriptions[id];
                if (subscription) {
                    subscription.destroy();
                    delete this.widgetContext.subscriptions[id];
                }
            }
        },
        controlApi: {
            sendOneWayCommand: (method?: any, params?: any, timeout?: any, ...rest: any[]) => {
                if (this.widgetContext.defaultSubscription) {
                    return this.widgetContext.defaultSubscription.sendOneWayCommand(method, params, timeout);
                }
                return null;
            },
            sendTwoWayCommand: (method?: any, params?: any, timeout?: any, ...rest: any[]) => {
                if (this.widgetContext.defaultSubscription) {
                    return this.widgetContext.defaultSubscription.sendTwoWayCommand(method, params, timeout);
                }
                return null;
            }
        },
        utils: {
            formatValue: this.formatValue
        },
        actionsApi: {
            actionDescriptorsBySourceId: this.actionDescriptorsBySourceId,
            getActionDescriptors: this.getActionDescriptors,
            handleWidgetAction: this.handleWidgetAction,
            elementClick: this.elementClick,
            getActiveEntityInfo: this.getActiveEntityInfo
        },
        stateController: this.stateController,
        aliasController: this.aliasController
    };
    this.widgetContext.customHeaderActions = [];
    this.headerActionsDescriptors = this.getActionDescriptors(types.widgetActionSources.headerButton.value);
    for (var i: any=0;i<this.headerActionsDescriptors.length;i++) {
        var descriptor: any = this.headerActionsDescriptors[i];
        var headerAction: any = {};
        headerAction.name = descriptor.name;
        headerAction.displayName = descriptor.displayName;
        headerAction.icon = descriptor.icon;
        headerAction.descriptor = descriptor;
        headerAction.onAction = ($event?: any) => {
            var entityInfo: any = vm.getActiveEntityInfo();
            var entityId: any = entityInfo ? entityInfo.entityId : null;
            var entityName: any = entityInfo ? entityInfo.entityName : null;
            var entityLabel: any = entityInfo && entityInfo.entityLabel ? entityInfo.entityLabel : null;
            vm.handleWidgetAction($event, this.descriptor, entityId, entityName, null, entityLabel);
        }
        this.widgetContext.customHeaderActions.push(headerAction);
    }
    this.subscriptionContext = {
        $scope: this,
        $q: $q,
        $filter: (name: string) => (value: any, ...args: any[]) => name === 'translate' ? this.translate.instant(value, args[0]) : value,
        $timeout: $timeout,
        tbRaf: this.tbRafRef,
        timeService: this.timeService,
        deviceService: this.deviceService,
        datasourceService: this.datasourceService,
        alarmService: this.alarmService,
        utils: this.utilsRef,
        widgetUtils: this.widgetContext.utils,
        dashboardTimewindowApi: this.dashboardTimewindowApi,
        types: types,
        getStDiff: this.dashboardService.getServerTimeDiff,
        aliasController: this.aliasController
    };
    this.widget.$ctx = function() {
        return this.widgetContext;
    }
    try {
        this.widgetTypeInstance = new this.widgetType(this.widgetContext);
    } catch (e: any) {
        this.handleWidgetException(e);
        this.widgetTypeInstance = {};
    }
    if (!this.widgetTypeInstance.onInit) {
        this.widgetTypeInstance.onInit = function() {};
    }
    if (!this.widgetTypeInstance.onDataUpdated) {
        this.widgetTypeInstance.onDataUpdated = function() {};
    }
    if (!this.widgetTypeInstance.onResize) {
        this.widgetTypeInstance.onResize = function() {};
    }
    if (!this.widgetTypeInstance.onEditModeChanged) {
        this.widgetTypeInstance.onEditModeChanged = function() {};
    }
    if (!this.widgetTypeInstance.onMobileModeChanged) {
        this.widgetTypeInstance.onMobileModeChanged = function() {};
    }
    if (!this.widgetTypeInstance.onDestroy) {
        this.widgetTypeInstance.onDestroy = function() {};
    }
    this.gridsterItemInitialized = this.gridsterItemInitialized;
    this.initialize().then(
        () =>{
            this.onInit();
        }
    );
  }

  clearRpcError(...rest: any[]): any {
    if (this.widgetContext.defaultSubscription) {
        this.widgetContext.defaultSubscription.clearRpcError();
    }
  }

  createSubscriptionFromInfo(type?: any, subscriptionsInfo?: any, options?: any, useDefaultComponents?: any, subscribe?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    options.type = type;

    if (useDefaultComponents) {
        this.defaultComponentsOptions(options);
    } else {
        if (!options.timeWindowConfig) {
            options.useDashboardTimewindow = true;
        }
    }

    var createDatasourcesPromise: any;
    if (options.type == types.widgetType.alarm.value) {
        createDatasourcesPromise = this.entityService.createAlarmSourceFromSubscriptionInfo(subscriptionsInfo);
    } else {
        createDatasourcesPromise = this.entityService.createDatasourcesFromSubscriptionsInfo(subscriptionsInfo);
    }

    createDatasourcesPromise.then(
        (result?: any) => {
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
                function fail() {
                    deferred.reject();
                }
            );
        }
    );
    return deferred.promise;
  }

  createSubscription(options?: any, subscribe?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    options.dashboardTimewindow = this.dashboardTimewindow;
    new Subscription(this.subscriptionContext, options).then(
        (subscription?: any) => {
            this.widgetContext.subscriptions[subscription.id] = subscription;
            if (subscribe) {
                subscription.subscribe();
            }
            deferred.resolve(subscription);
        },
        function fail() {
            deferred.reject();
        }
    );

    return deferred.promise;
  }

  defaultComponentsOptions(options?: any, ...rest: any[]): any {
    options.useDashboardTimewindow = (this.widget.config.useDashboardTimewindow !== undefined)
        ? this.widget.config.useDashboardTimewindow : true;

    options.displayTimewindow = (this.widget.config.displayTimewindow !== undefined)
        ? this.widget.config.displayTimewindow : !options.useDashboardTimewindow;

    options.timeWindowConfig = options.useDashboardTimewindow ? this.dashboardTimewindow : this.widget.config.timewindow;
    options.legendConfig = null;

    if (this.displayLegend) {
        options.legendConfig = this.legendConfig;
    }
    options.decimals = this.widgetContext.decimals;
    options.units = this.widgetContext.units;

    options.callbacks = {
        onDataUpdated: (...rest: any[]) => {
            if (this.displayWidgetInstance()) {
                this.widgetTypeInstance.onDataUpdated();
            }
        },
        onDataUpdateError: (subscription?: any, e?: any, ...rest: any[]) => {
            this.handleWidgetException(e);
        },
        dataLoading: (subscription?: any, ...rest: any[]) => {
            if (this.loadingData !== subscription.loadingData) {
                this.loadingData = subscription.loadingData;
            }
        },
        legendDataUpdated: (subscription?: any, apply?: any, ...rest: any[]) => {
            if (apply) {

            }
        },
        timeWindowUpdated: (subscription?: any, timeWindowConfig?: any, ...rest: any[]) => {
            this.widget.config.timewindow = timeWindowConfig;

        }
    }
  }

  private timewindowWatchSubscription: any;
  private prevWatchedTimewindow: any;

  defaultSubscriptionOptions(subscription?: any, options?: any, ...rest: any[]): any {
    if (!options.useDashboardTimewindow) {
        this.timewindowWatchSubscription = subscription;
        this.prevWatchedTimewindow = structuredClone(this.widget.config.timewindow);
    }
    if (this.displayLegend) {
        this.legendData = subscription.legendData;
    }
  }

  ngDoCheck(): void {
    if (this.timewindowWatchSubscription) {
        const newTimewindow: any = this.widget.config.timewindow;
        if (JSON.stringify(newTimewindow) !== JSON.stringify(this.prevWatchedTimewindow)) {
            this.prevWatchedTimewindow = structuredClone(newTimewindow);
            this.timewindowWatchSubscription.updateTimewindowConfig(this.widget.config.timewindow);
        }
    }
  }

  createDefaultSubscription(...rest: any[]): any {
    var options: any;
    var deferred: any = $q.defer();
    if (this.widget.type !== types.widgetType.rpc.value && this.widget.type !== types.widgetType.static.value) {
        options = {
            type: this.widget.type,
            stateData: this.typeParameters.stateData,
            comparisonEnabled: this.widgetContext.settings.comparisonEnabled,
            timeForComparison: this.widgetContext.settings.timeForComparison
        };
        if (this.widget.type == types.widgetType.alarm.value) {
            options.alarmSource = structuredClone(this.widget.config.alarmSource);
            options.alarmSearchStatus = (this.widget.config.alarmSearchStatus !== undefined) ?
                this.widget.config.alarmSearchStatus : types.alarmSearchStatus.any;
            options.alarmsPollingInterval = (this.widget.config.alarmsPollingInterval !== undefined) ?
                this.widget.config.alarmsPollingInterval * 1000 : 5000;
            options.alarmsMaxCountLoad = (this.widget.config.alarmsMaxCountLoad !== undefined) ?
                this.widget.config.alarmsMaxCountLoad : 0;
            options.alarmsFetchSize = (this.widget.config.alarmsFetchSize !== undefined) ?
                this.widget.config.alarmsFetchSize : 100;
        } else {
            options.datasources = structuredClone(this.widget.config.datasources)
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
            function fail() {
                deferred.reject();
            }
        );

    } else if (this.widget.type === types.widgetType.rpc.value) {
        this.loadingData = false;
        options = {
            type: this.widget.type,
            targetDeviceAliasIds: this.widget.config.targetDeviceAliasIds
        }
        options.callbacks = {
            rpcStateChanged: (subscription?: any, ...rest: any[]) => {
                this.rpcEnabled = subscription.rpcEnabled;
                this.executingRpcRequest = subscription.executingRpcRequest;
            },
            onRpcSuccess: (subscription?: any, ...rest: any[]) => {
               this.executingRpcRequest = subscription.executingRpcRequest;
                this.rpcErrorText = subscription.rpcErrorText;
                this.rpcRejection = subscription.rpcRejection;
            },
            onRpcFailed: (subscription?: any, ...rest: any[]) => {
                this.executingRpcRequest = subscription.executingRpcRequest;
                this.rpcErrorText = subscription.rpcErrorText;
                this.rpcRejection = subscription.rpcRejection;
            },
            onRpcErrorCleared: (...rest: any[]) => {
                this.rpcErrorText = null;
                this.rpcRejection = null;
            }
        }
        this.createSubscription(options).then(
            (subscription?: any) => {
                this.widgetContext.defaultSubscription = subscription;
                deferred.resolve();
            },
            function fail() {
                deferred.reject();
            }
        );
    } else if (this.widget.type === types.widgetType.static.value) {
        this.loadingData = false;
        deferred.resolve();
    } else {
        deferred.resolve();
    }
    return deferred.promise;
  }

  getActionDescriptors = (actionSourceId?: any, ...rest: any[]): any => {
    var result: any = this.widgetContext.actionsApi.actionDescriptorsBySourceId[actionSourceId];
    if (!result) {
        result = [];
    }
    return result;
  };

  elementClick = (event?: any, ...rest: any[]): any => {
    var e: any = event.target || event.srcElement;
    if (e.id) {
        var descriptors: any = this.getActionDescriptors('elementClick');
        if (descriptors.length) {
            for (var i: any = 0; i < descriptors.length; i++) {
                if (descriptors[i].name == e.id) {
                    event.stopPropagation();
                    var entityInfo: any = this.getActiveEntityInfo();
                    var entityId: any = entityInfo ? entityInfo.entityId : null;
                    var entityName: any = entityInfo ? entityInfo.entityName : null;
                    var entityLabel: any = entityInfo && entityInfo.entityLabel ? entityInfo.entityLabel : null;
                    this.handleWidgetAction(event, descriptors[i], entityId, entityName, null, entityLabel);
                }
            }
        }
    }
  };

  updateEntityParams(params?: any, targetEntityParamName?: any, targetEntityId?: any, entityName?: any, entityLabel?: any, ...rest: any[]): any {
       if (targetEntityId) {
           var targetEntityParams: any;
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

  handleWidgetAction = ($event?: any, descriptor?: any, entityId?: any, entityName?: any, additionalParams?: any, entityLabel?: any, ...rest: any[]): any => {
    var type: any = descriptor.type;
    var targetEntityParamName: any = descriptor.stateEntityParamName;
    var targetEntityId: any;
    if (descriptor.setEntityId) {
        targetEntityId = entityId;
    }
    switch (type) {
        case types.widgetActionTypes.openDashboardState.value:
        case types.widgetActionTypes.updateDashboardState.value:
            var targetDashboardStateId: any = descriptor.targetDashboardStateId;
            var params: any = structuredClone(this.widgetContext.stateController.getStateParams());
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
        case types.widgetActionTypes.openDashboard.value:
            var targetDashboardId: any = descriptor.targetDashboardId;
            targetDashboardStateId = descriptor.targetDashboardStateId;
            var stateObject: any = {};
            stateObject.params = {};
            this.updateEntityParams(stateObject.params, targetEntityParamName, targetEntityId, entityName, entityLabel);
            if (targetDashboardStateId) {
                stateObject.id = targetDashboardStateId;
            }
            var stateParams: any = {
                dashboardId: targetDashboardId,
                state: this.utilsRef.objToBase64([ stateObject ])
            }
            if ((this.router as any).current.name === 'dashboard') {
                (this.router as any).go('dashboard', stateParams);
            } else {
                (this.router as any).go('home.dashboards.dashboard', stateParams);
            }
            break;
        case types.widgetActionTypes.custom.value:
            var customFunction: any = descriptor.customFunction;
            if ((customFunction !== undefined) && customFunction.length > 0) {
                try {
                    if (!additionalParams) {
                        additionalParams = {};
                    }
                    var customActionFunction: any = new Function('$event', 'widgetContext', 'entityId', 'entityName', 'additionalParams', customFunction);
                    customActionFunction($event, this.widgetContext, entityId, entityName, additionalParams);
                } catch (e: any) {
                    //
                }
            }
            break;
        case types.widgetActionTypes.customPretty.value:
            var customPrettyFunction: any = descriptor.customFunction;
            var customHtml: any = descriptor.customHtml;
            var customCss: any = descriptor.customCss;
            var customResources: any = descriptor.customResources;
            var actionNamespace: any = 'custom-action-pretty-'+descriptor.name.toLowerCase();
            var htmlTemplate: any = '';
            if ((customHtml !== undefined) && customHtml.length > 0) {
                htmlTemplate = customHtml;
            }
            this.loadCustomActionResources(actionNamespace, customCss, customResources).then(
                () => {
                    if ((customPrettyFunction !== undefined) && customPrettyFunction.length > 0) {
                        try {
                            if (!additionalParams) {
                                additionalParams = {};
                            }
                            var customActionPrettyFunction: any = new Function('$event', 'widgetContext', 'entityId', 'entityName', 'htmlTemplate', 'additionalParams', customPrettyFunction);
                            customActionPrettyFunction($event, this.widgetContext, entityId, entityName, htmlTemplate, additionalParams);
                        } catch (e: any) {
                            //
                        }
                    }
                },
                (errorMessages?: any) => {
                    this.processResourcesLoadErrors(errorMessages);
                }
            );
            break;
    }
  };

  loadCustomActionResources(actionNamespace?: any, customCss?: any, customResources?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();

    if ((customCss !== undefined) && customCss.length > 0) {
        this.cssParser.cssPreviewNamespace = actionNamespace;
        this.cssParser.createStyleElement(actionNamespace, customCss, 'nonamespace');
    }

    function loadNextOrComplete(i?: any): any {
        i++;
        if (i < customResources.length) {
            loadNext(i);
        } else {
            if (errors.length > 0) {
                deferred.reject(errors);
            } else {
                deferred.resolve();
            }
        }
    }

    function loadNext(i?: any): any {
         var resourceUrl: any = customResources[i].url;
        if (resourceUrl && resourceUrl.length > 0) {
            new Promise<void>((resolve, reject) => {
                const script: HTMLScriptElement = document.createElement('script');
                script.src = resourceUrl;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.head.appendChild(script);
            }).then(
                function success () {
                    loadNextOrComplete(i);
                },
                function fail() {
                    errors.push('Failed to load custom action resource: \'' + resourceUrl + '\'');
                    loadNextOrComplete(i);
                }
            );
        } else {
            loadNextOrComplete(i);
        }
    }

    if ((customResources !== undefined) && customResources.length > 0) {
        var errors: any = [];
        loadNext(0);
    } else {
        deferred.resolve();
    }

    return deferred.promise;
  }

  processResourcesLoadErrors(errorMessages?: any, ...rest: any[]): any {
    var messageToShow: any = '';
    for (var e in errorMessages) {
        var error: any = errorMessages[e];
        messageToShow += '<div>' + error + '</div>';
    }
    this.toast.showError(messageToShow);
  }

  getActiveEntityInfo = (...rest: any[]): any => {
    var entityInfo: any = this.widgetContext.activeEntityInfo;
    if (!entityInfo) {
        for (var id in this.widgetContext.subscriptions) {
            var subscription: any = this.widgetContext.subscriptions[id];
            entityInfo = subscription.getFirstEntityInfo();
            if (entityInfo) {
                break;
            }
        }
    }
    return entityInfo;
  };

  configureWidgetElement(...rest: any[]): any {

    this.displayLegend = (this.widget.config.showLegend !== undefined) ?
        this.widget.config.showLegend : this.widget.type === types.widgetType.timeseries.value;

    if (this.displayLegend) {
        this.legendConfig = this.widget.config.legendConfig ||
            {
                position: types.position.bottom.value,
                showMin: false,
                showMax: false,
                showAvg: this.widget.type === types.widgetType.timeseries.value,
                showTotal: false
            };
        this.legendData = {
            keys: [],
            data: []
        };
    }

    var html: any = '<div class="tb-absolute-fill tb-widget-error" ng-if="widgetErrorData">' +
        '<span>Widget Error: {{ widgetErrorData.name + ": " + widgetErrorData.message}}</span>' +
        '</div>' +
        '<div class="tb-absolute-fill tb-widget-loading" ng-show="loadingData" layout="column" layout-align="center center">' +
        '<md-progress-circular md-mode="indeterminate" ng-disabled="!loadingData" class="md-accent" md-diameter="40"></md-progress-circular>' +
        '</div>';

    var containerHtml: any = '<div id="container">' + this.widgetInfo.templateHtml + '</div>';
    if (this.displayLegend) {
        var layoutType: any;
        if (this.legendConfig.position === types.position.top.value ||
            this.legendConfig.position === types.position.bottom.value) {
            layoutType = 'column';
        } else {
            layoutType = 'row';
        }

        var legendStyle: any;
        switch(this.legendConfig.position) {
            case types.position.top.value:
                legendStyle = 'padding-bottom: 8px; max-height: 50%; overflow-y: auto;';
                break;
            case types.position.bottom.value:
                legendStyle = 'padding-top: 8px; max-height: 50%; overflow-y: auto;';
                break;
            case types.position.left.value:
                legendStyle = 'padding-right: 0px; max-width: 50%; overflow-y: auto;';
                break;
            case types.position.right.value:
                legendStyle = 'padding-left: 0px; max-width: 50%; overflow-y: auto;';
                break;
        }

        var legendHtml: any = '<tb-legend style="'+legendStyle+'" legend-config="legendConfig" legend-data="legendData"></tb-legend>';
        containerHtml = '<div flex id="widget-container">' + containerHtml + '</div>';
        html += '<div class="tb-absolute-fill" layout="'+layoutType+'">';
        if (this.legendConfig.position === types.position.top.value ||
            this.legendConfig.position === types.position.left.value) {
            html += legendHtml;
            html += containerHtml;
        } else {
            html += containerHtml;
            html += legendHtml;
        }
        html += '</div>';
    } else {
        html += containerHtml;
    }

    //TODO:
    /*if (progressElement) {
     progressScope.$destroy();
     progressScope = null;

     progressElement.remove();
     progressElement = null;
     }*/

    $(this.element.nativeElement).html(html);

    var containerElement: any = this.displayLegend ? $(this.element.nativeElement.querySelector('#widget-container')) : $(this.element.nativeElement);
    this.widgetContext.$container = $('#container', containerElement);
    this.widgetContext.$containerParent = $(containerElement);

    if (this.widgetSizeDetected) {
        this.widgetContext.$container.css('height', this.widgetContext.height + 'px');
        this.widgetContext.$container.css('width', this.widgetContext.width + 'px');
    }

    this.widgetContext.$scope = { $destroy: () => {} };

    const containerEl = this.widgetContext.$containerParent[0];
    const resizeObserver = new ResizeObserver(() => this.onResize());
    resizeObserver.observe(containerEl);
    (containerEl as any).__resizeObserver = resizeObserver;
  }

  destroyWidgetElement(...rest: any[]): any {
    const containerEl = this.widgetContext.$containerParent[0];
    if (containerEl && (containerEl as any).__resizeObserver) {
        (containerEl as any).__resizeObserver.disconnect();
        delete (containerEl as any).__resizeObserver;
    }
    $(this.element.nativeElement).html('');
    if (this.widgetContext.$scope) {
        this.widgetContext.$scope.$destroy();
    }
    this.widgetContext.$container = null;
    this.widgetContext.$containerParent = null;
  }

  initialize(...rest: any[]): any {

    this.rootScope.$on('toggleDashboardEditMode', (event?: any, isEdit?: any) => {
        this.onEditModeChanged(isEdit);
    });

    let widgetPositionKey = this.widget().row + ',' + this.widget().col + ',' + this.widget().config.mobileOrder;
    const widgetPositionCheckInterval = setInterval(() => {
        const newWidgetPositionKey = this.widget().row + ',' + this.widget().col + ',' + this.widget().config.mobileOrder;
        if (newWidgetPositionKey !== widgetPositionKey) {
            widgetPositionKey = newWidgetPositionKey;
            //updateBounds();
            this.rootScope.$emit("widgetPositionChanged", this.widget());
        }
    }, 200);
    this.destroyRef.onDestroy(() => clearInterval(widgetPositionCheckInterval));

    this.rootScope.$on('gridster-item-resized', (event?: any, item?: any) => {
        if (!this.widgetContext.isMobile) {
            this.widget().sizeX = item.sizeX;
            this.widget().sizeY = item.sizeY;
        }
    });

    this.rootScope.$on('mobileModeChanged', (event?: any, newIsMobile?: any) => {
        this.onMobileModeChanged(newIsMobile);
    });

    this.rootScope.$on('entityAliasesChanged', (event?: any, aliasIds?: any) => {
        var subscriptionChanged: any = false;
        for (var id in this.widgetContext.subscriptions) {
            var subscription: any = this.widgetContext.subscriptions[id];
            subscriptionChanged = subscriptionChanged || subscription.onAliasesChanged(aliasIds);
        }
        if (subscriptionChanged && !this.typeParameters.useCustomDatasources) {
            this.reInit();
        }
    });

    this.rootScope.$on('dashboardTimewindowChanged', (event?: any, newDashboardTimewindow?: any) => {
        this.dashboardTimewindow = newDashboardTimewindow;
        this.widgetContext.dashboardTimewindow = newDashboardTimewindow;
    });

    this.rootScope.$on('widgetForceReInit', () => {
        this.reInit();
    });

    this.destroyRef.onDestroy(() => {
        this.onDestroy();
    });

    this.configureWidgetElement();
    var deferred: any = $q.defer();
    if (!this.typeParameters.useCustomDatasources) {
        this.createDefaultSubscription().then(
            () => {
                this.subscriptionInited = true;
                deferred.resolve();
            },
            () => {
                this.subscriptionInited = true;
                deferred.reject();
            }
        );
    } else {
        this.loadingData = false;
        this.subscriptionInited = true;
        deferred.resolve();
    }
    return deferred.promise;
  }

  reInit(...rest: any[]): any {
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
            }
        );
    } else {
        this.subscriptionInited = true;
        this.onInit();
    }
  }

  handleWidgetException(e?: any, ...rest: any[]): any {
    console.error(e);
    this.widgetErrorData = this.utilsRef.processWidgetException(e);
  }

  isReady(...rest: any[]): any {
    return this.subscriptionInited && this.gridsterItemInited && this.widgetSizeDetected;
  }

  onInit(skipSizeCheck?: any, ...rest: any[]): any {
    if (!this.widgetContext.$containerParent) {
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
        if (!this.typeParameters.useCustomDatasources && this.widgetContext.defaultSubscription) {
            this.widgetContext.defaultSubscription.subscribe();
        }
    }
  }

  checkSize(...rest: any[]): any {
    var width: any = this.widgetContext.$containerParent.width();
    var height: any = this.widgetContext.$containerParent.height();
    var sizeChanged: any = false;

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

  onResize = (...rest: any[]): any => {
    if (this.checkSize()) {
        if (this.widgetContext.inited) {
            if (this.cafs['resize']) {
                this.cafs['resize']();
                this.cafs['resize'] = null;
            }
            this.cafs['resize'] = (this.tbRafRef as any)(() => {
                try {
                    if (this.displayWidgetInstance()) {
                        this.widgetTypeInstance.onResize();
                    }
                } catch (e: any) {
                    this.handleWidgetException(e);
                }
            });
        } else {
            this.onInit(true);
        }
    }
  };

  gridsterItemInitialized = (item?: any, ...rest: any[]): any => {
    if (item && item.gridster) {
        this.gridsterItemInited = true;
        this.onInit();
        // gridsterItemElement = $(item.$element);
        //updateVisibility();
    }
  };

  onEditModeChanged(isEdit?: any, ...rest: any[]): any {
    if (this.widgetContext.isEdit != isEdit) {
        this.widgetContext.isEdit = isEdit;
        if (this.widgetContext.inited) {
            if (this.cafs['editMode']) {
                this.cafs['editMode']();
                this.cafs['editMode'] = null;
            }
            this.cafs['editMode'] = (this.tbRafRef as any)(() => {
                try {
                    if (this.displayWidgetInstance()) {
                        this.widgetTypeInstance.onEditModeChanged();
                    }
                } catch (e: any) {
                    this.handleWidgetException(e);
                }
            });
        }
    }
  }

  onMobileModeChanged(isMobile?: any, ...rest: any[]): any {
    if (this.widgetContext.isMobile != isMobile) {
        this.widgetContext.isMobile = isMobile;
        if (this.widgetContext.inited) {
            if (this.cafs['mobileMode']) {
                this.cafs['mobileMode']();
                this.cafs['mobileMode'] = null;
            }
            this.cafs['mobileMode'] = (this.tbRafRef as any)(() => {
                try {
                    if (this.displayWidgetInstance()) {
                        this.widgetTypeInstance.onMobileModeChanged();
                    }
                } catch (e: any) {
                    this.handleWidgetException(e);
                }
            });
        }
    }
  }

  isNumeric(val?: any, ...rest: any[]): any {
    return (val - parseFloat( val ) + 1) >= 0;
  }

  formatValue = (value?: any, dec?: any, units?: any, showZeroDecimals?: any, ...rest: any[]): any => {
    if ((value !== undefined) &&
        value !== null && this.isNumeric(value)) {
        var formatted: any = Number(value);
        if ((dec !== undefined)) {
            formatted = formatted.toFixed(dec);
        }
        if (!showZeroDecimals) {
            formatted = (formatted * 1);
        }
        formatted = formatted.toString();
        if ((units !== undefined) && units.length > 0) {
            formatted += ' ' + units;
        }
        return formatted;
    } else {
        return value;
    }
    return undefined;
  };

  displayWidgetInstance(...rest: any[]): any {
    if (this.widget().type !== types.widgetType.static.value) {
        for (var id in this.widgetContext.subscriptions) {
            if (this.widgetContext.subscriptions[id].isDataResolved()) {
                return true;
            }
        }
        return false;
    } else {
        return true;
    }
    return undefined;
  }

  onDestroy(...rest: any[]): any {
    var shouldDestroyWidgetInstance: any = this.displayWidgetInstance();
    for (var id in this.widgetContext.subscriptions) {
        var subscription: any = this.widgetContext.subscriptions[id];
        subscription.destroy();
    }
    this.subscriptionInited = false;
    this.widgetContext.subscriptions = {};
    if (this.widgetContext.inited) {
        this.widgetContext.inited = false;
        for (var cafId in this.cafs) {
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
