import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';
import $ from 'jquery';
import moment from 'moment';
import tinycolor from 'tinycolor2';
import TbFlot from '../../../../app/widget/lib/flot-widget';
import TbAnalogueLinearGauge from '../../../../app/widget/lib/analogue-linear-gauge';
import TbAnalogueRadialGauge from '../../../../app/widget/lib/analogue-radial-gauge';
import TbAnalogueCompass from '../../../../app/widget/lib/analogue-compass';
import TbCanvasDigitalGauge from '../../../../app/widget/lib/canvas-digital-gauge';
import TbMapWidget from '../../../../app/widget/lib/map-widget';
import TbMapWidgetV2 from '../../../../app/widget/lib/map-widget2';
import cssjs from '../../../../vendor/css.js/css';

import { filter } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let vm: any;
declare let $filter: any;
declare let $ocLazyLoad: any;
declare let $q: any;
declare let $window: any;

/**
 * Ported from the AngularJS factory `widgetService` (module `thingsboard.api.widget`) in src/app/api/widget.service.js:53.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class WidgetService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  private readonly http = inject(HttpClient);
  // TODO(port): '$ocLazyLoad' — an AngularJS built-in with no Angular counterpart
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly rootScope = inject(RootState);
  private readonly translate = inject(TranslateService);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  private readonly utils = inject(UtilsService);

  private cssParser: any = new cssjs();
  private missingWidgetType: any;
  private errorWidgetType: any;
  private editingWidgetType: any;
  private widgetsInfoInMemoryCache: any = {};
  private widgetsTypeFunctionsInMemoryCache: any = {};
  private widgetsInfoFetchQueue: any = {};
  private allWidgetsBundles: any = undefined;
  private systemWidgetsBundles: any = undefined;
  private tenantWidgetsBundles: any = undefined;

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$on — a root scope event: subscribe to the service that raises it
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    window.$ = $;
    window.jQuery = $;
    window.moment = moment;
    window.tinycolor = tinycolor;
    window.lazyLoad = $ocLazyLoad;
    window.TbFlot = TbFlot;
    window.TbAnalogueLinearGauge = TbAnalogueLinearGauge;
    window.TbAnalogueRadialGauge = TbAnalogueRadialGauge;
    window.TbAnalogueCompass = TbAnalogueCompass;
    window.TbCanvasDigitalGauge = TbCanvasDigitalGauge;
    window.TbMapWidget = TbMapWidget;
    window.TbMapWidgetV2 = TbMapWidgetV2;
    window.cssjs = cssjs;
    this.cssParser.testMode = false;
    inject(Router).events.pipe(
        filter((event: any) => event?.constructor?.name === 'NavigationStart')
    ).subscribe(() => {
        this.invalidateWidgetsBundleCache();
    });
    this.initEditingWidgetType();
    this.initWidgetPlaceholders();
  }

  initEditingWidgetType(...rest: any[]): any {
    if (this.rootScope.widgetEditMode) {
        this.editingWidgetType =
            this.toWidgetType({
                widgetName: this.rootScope.editWidgetInfo.widgetName,
                alias: 'customWidget',
                type: this.rootScope.editWidgetInfo.type,
                sizeX: this.rootScope.editWidgetInfo.sizeX,
                sizeY: this.rootScope.editWidgetInfo.sizeY,
                resources: this.rootScope.editWidgetInfo.resources,
                templateHtml: this.rootScope.editWidgetInfo.templateHtml,
                templateCss: this.rootScope.editWidgetInfo.templateCss,
                controllerScript: this.rootScope.editWidgetInfo.controllerScript,
                settingsSchema: this.rootScope.editWidgetInfo.settingsSchema,
                dataKeySettingsSchema: this.rootScope.editWidgetInfo.dataKeySettingsSchema,
                defaultConfig: this.rootScope.editWidgetInfo.defaultConfig
        }, {id: '1'}, { id: types.id.nullUid }, 'customWidgetBundle');
    }
  }

  initWidgetPlaceholders(...rest: any[]): any {
    let self = this;

    this.missingWidgetType = {
        widgetName: 'Widget type not found',
        alias: 'undefined',
        sizeX: 8,
        sizeY: 6,
        resources: [],
        templateHtml: '<div class="tb-widget-error-container"><div translate class="tb-widget-error-msg">widget.widget-type-not-found</div></div>',
        templateCss: '',
        controllerScript: 'self.onInit = function() {}',
        settingsSchema: '{}\n',
        dataKeySettingsSchema: '{}\n',
        defaultConfig: '{\n' +
        '"title": "Widget type not found",\n' +
        '"datasources": [],\n' +
        '"settings": {}\n' +
        '}\n'
    };

    this.errorWidgetType = {
        widgetName: 'Error loading widget',
        alias: 'error',
        sizeX: 8,
        sizeY: 6,
        resources: [],
        templateHtml: '<div class="tb-widget-error-container"><div translate class="tb-widget-error-msg">widget.widget-type-load-error</div>',
        templateCss: '',
        controllerScript: 'self.onInit = function() {}',
        settingsSchema: '{}\n',
        dataKeySettingsSchema: '{}\n',
        defaultConfig: '{\n' +
        '"title": "Widget failed to load",\n' +
        '"datasources": [],\n' +
        '"settings": {}\n' +
        '}\n'
    };
  }

  toWidgetInfo(widgetType?: any, ...rest: any[]): any {

    var widgetInfo: any = {
        widgetName: widgetType.name,
        alias: widgetType.alias
    }

    var descriptor: any = widgetType.descriptor;

    widgetInfo.type = descriptor.type;
    widgetInfo.sizeX = descriptor.sizeX;
    widgetInfo.sizeY = descriptor.sizeY;
    widgetInfo.resources = descriptor.resources;
    widgetInfo.templateHtml = descriptor.templateHtml;
    widgetInfo.templateCss = descriptor.templateCss;
    widgetInfo.controllerScript = descriptor.controllerScript;
    widgetInfo.settingsSchema = descriptor.settingsSchema;
    widgetInfo.dataKeySettingsSchema = descriptor.dataKeySettingsSchema;
    widgetInfo.defaultConfig = descriptor.defaultConfig;

    return widgetInfo;
  }

  toWidgetType(widgetInfo?: any, id?: any, tenantId?: any, bundleAlias?: any, ...rest: any[]): any {
    var widgetType: any = {
        id: id,
        tenantId: tenantId,
        bundleAlias: bundleAlias,
        alias: widgetInfo.alias,
        name: widgetInfo.widgetName
    }

    var descriptor: any = {
        type: widgetInfo.type,
        sizeX: widgetInfo.sizeX,
        sizeY: widgetInfo.sizeY,
        resources: widgetInfo.resources,
        templateHtml: widgetInfo.templateHtml,
        templateCss: widgetInfo.templateCss,
        controllerScript: widgetInfo.controllerScript,
        settingsSchema: widgetInfo.settingsSchema,
        dataKeySettingsSchema: widgetInfo.dataKeySettingsSchema,
        defaultConfig: widgetInfo.defaultConfig
    }

    widgetType.descriptor = descriptor;

    return widgetType;
  }

  getWidgetTemplate(type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var templateWidgetType: any = types.widgetType.timeseries;
    for (var t in types.widgetType) {
        var widgetType: any = types.widgetType[t];
        if (widgetType.value === type) {
            templateWidgetType = widgetType;
            break;
        }
    }
    this.getWidgetType(templateWidgetType.template.bundleAlias,
                  templateWidgetType.template.alias, true).then(
                      (widgetType?: any) => {
                          var widgetInfo: any = this.toWidgetInfo(widgetType);
                          widgetInfo.alias = undefined;
                          deferred.resolve(widgetInfo);
                      },
                      function fail() {
                          deferred.reject();
                      }
    );
    return deferred.promise;
  }

  createWidgetInfoCacheKey(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    return (isSystem ? 'sys_' : '') + bundleAlias + '_' + widgetTypeAlias;
  }

  getWidgetInfoFromCache(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetTypeAlias, isSystem);
    return this.widgetsInfoInMemoryCache[key];
  }

  getWidgetTypeFunctionFromCache(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetTypeAlias, isSystem);
    return this.widgetsTypeFunctionsInMemoryCache[key];
  }

  putWidgetInfoToCache(widgetInfo?: any, bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetTypeAlias, isSystem);
    this.widgetsInfoInMemoryCache[key] = widgetInfo;
  }

  putWidgetTypeFunctionToCache(widgetTypeFunction?: any, bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetTypeAlias, isSystem);
    this.widgetsTypeFunctionsInMemoryCache[key] = widgetTypeFunction;
  }

  deleteWidgetInfoFromCache(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetTypeAlias, isSystem);
    delete this.widgetsInfoInMemoryCache[key];
    delete this.widgetsTypeFunctionsInMemoryCache[key];
  }

  deleteWidgetsBundleFromCache(bundleAlias?: any, isSystem?: any, ...rest: any[]): any {
    var key: any = (isSystem ? 'sys_' : '') + bundleAlias;
    for (var cacheKey in this.widgetsInfoInMemoryCache) {
        if (cacheKey.startsWith(key)) {
            delete this.widgetsInfoInMemoryCache[cacheKey];
            delete this.widgetsTypeFunctionsInMemoryCache[cacheKey];
        }
    }
  }

  invalidateWidgetsBundleCache(...rest: any[]): any {
    this.allWidgetsBundles = undefined;
    this.systemWidgetsBundles = undefined;
    this.tenantWidgetsBundles = undefined;
  }

  loadWidgetsBundleCache(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!this.allWidgetsBundles) {
        var url: any = '/api/widgetsBundles';
        firstValueFrom(this.http.get(url, config)).then((response?: any) => {
            this.allWidgetsBundles = response.data;
            this.systemWidgetsBundles = [];
            this.tenantWidgetsBundles = [];
            this.allWidgetsBundles = $filter('orderBy')(this.allWidgetsBundles, ['+title', '-createdTime']);
            for (var i: any = 0; i < this.allWidgetsBundles.length; i++) {
                var widgetsBundle: any = this.allWidgetsBundles[i];
                if (widgetsBundle.tenantId.id === types.id.nullUid) {
                    this.systemWidgetsBundles.push(widgetsBundle);
                } else {
                    this.tenantWidgetsBundles.push(widgetsBundle);
                }
            }
            deferred.resolve();
        }, function fail() {
            deferred.reject();
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise;
  }

  getSystemWidgetsBundles(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache(config).then(
        () => {
            deferred.resolve(this.systemWidgetsBundles);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getTenantWidgetsBundles(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache(config).then(
        () => {
            deferred.resolve(this.tenantWidgetsBundles);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getAllWidgetsBundles(config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache(config).then(
        () => {
            deferred.resolve(this.allWidgetsBundles);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getSystemWidgetsBundlesByPageLink(pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache().then(
        () => {
            this.utils.filterSearchTextEntities(this.systemWidgetsBundles, 'title', pageLink, deferred);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getTenantWidgetsBundlesByPageLink(pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache().then(
        () => {
            this.utils.filterSearchTextEntities(this.tenantWidgetsBundles, 'title', pageLink, deferred);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getAllWidgetsBundlesByPageLink(pageLink?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache().then(
        () => {
            this.utils.filterSearchTextEntities(this.allWidgetsBundles, 'title', pageLink, deferred);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  getWidgetsBundleByAlias(bundleAlias?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadWidgetsBundleCache().then(
        () => {
            var widgetsBundles: any = this.allWidgetsBundles.filter((wb: any) => wb.alias === bundleAlias);
            if (widgetsBundles.length > 0) {
                deferred.resolve(widgetsBundles[0]);
            } else {
                deferred.resolve();
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  saveWidgetsBundle(widgetsBundle?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/widgetsBundle';
    firstValueFrom(this.http.post(url, widgetsBundle)).then((response?: any) => {
        this.invalidateWidgetsBundleCache();
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response);
    });
    return deferred.promise;
  }

  getWidgetsBundle(widgetsBundleId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();

    var url: any = '/api/widgetsBundle/' + widgetsBundleId;
    firstValueFrom(this.http.get(url, null)).then(function success(response?: any) {
        deferred.resolve(response);
    }, function fail(response?: any) {
        deferred.reject(response);
    });

    return deferred.promise;
  }

  deleteWidgetsBundle(widgetsBundleId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();

    this.getWidgetsBundle(widgetsBundleId).then(
        (response?: any) => {
            var widgetsBundle: any = response;
            var url: any = '/api/widgetsBundle/' + widgetsBundleId;
            firstValueFrom(this.http.delete(url)).then(() => {
                this.invalidateWidgetsBundleCache();
                this.deleteWidgetsBundleFromCache(widgetsBundle.alias,
                    widgetsBundle.tenantId.id === types.id.nullUid);
                deferred.resolve();
            }, function fail(response?: any) {
                deferred.reject(response);
            });
        },
        function fail() {
            deferred.reject();
        }
    );

    return deferred.promise;
  }

  getBundleWidgetTypes(bundleAlias?: any, isSystem?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/widgetTypes?isSystem=' + (isSystem ? 'true' : 'false') +
                '&bundleAlias='+bundleAlias;
    firstValueFrom(this.http.get(url, null)).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail(response?: any) {
        deferred.reject(response.data);
    });
    return deferred.promise;
  }

  getInstantWidgetInfo(widget?: any, ...rest: any[]): any {
    var widgetInfo: any = this.getWidgetInfoFromCache(widget.bundleAlias, widget.typeAlias, widget.isSystemType);
    if (widgetInfo) {
        return widgetInfo;
    } else {
        return {};
    }
    return undefined;
  }

  resolveWidgetsInfoFetchQueue(key?: any, widgetInfo?: any, ...rest: any[]): any {
    var fetchQueue: any = this.widgetsInfoFetchQueue[key];
    if (fetchQueue) {
        for (var q in fetchQueue) {
            if (isNaN(Number(q)))
              continue;
            fetchQueue[q].resolve(widgetInfo);
        }
        delete this.widgetsInfoFetchQueue[key];
    }
  }

  getWidgetInfo(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var widgetInfo: any = this.getWidgetInfoFromCache(bundleAlias, widgetTypeAlias, isSystem);
    if (widgetInfo) {
        deferred.resolve(widgetInfo);
    } else {
        if (this.rootScope.widgetEditMode) {
            this.loadWidget(this.editingWidgetType, bundleAlias, isSystem, deferred);
        } else {
            var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetTypeAlias, isSystem);
            var fetchQueue: any = this.widgetsInfoFetchQueue[key];
            if (fetchQueue) {
                fetchQueue.push(deferred);
            } else {
                fetchQueue = [];
                this.widgetsInfoFetchQueue[key] = fetchQueue;
                this.getWidgetType(bundleAlias, widgetTypeAlias, isSystem).then(
                    (widgetType?: any) => {
                        this.loadWidget(widgetType, bundleAlias, isSystem, deferred);
                    }, () => {
                        deferred.resolve(this.missingWidgetType);
                        this.resolveWidgetsInfoFetchQueue(key, this.missingWidgetType);
                    }
                );
            }
        }
    }
    return deferred.promise;
  }

  getWidgetTypeFunction(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var widgetType: any = this.getWidgetTypeFunctionFromCache(bundleAlias, widgetTypeAlias, isSystem);
    return widgetType;
  }

  createWidgetTypeFunction(this: any, widgetInfo?: any, name?: any, ...rest: any[]): any {
    let vm = this;
    var widgetTypeFunctionBody: any = 'return function '+ name +' (ctx) {\n' +
        '    var self = this;\n' +
        '    self.ctx = ctx;\n\n'; /*+

     '    self.onInit = function() {\n\n' +

     '    }\n\n' +

     '    self.onDataUpdated = function() {\n\n' +

     '    }\n\n' +

     '    self.useCustomDatasources = function() {\n\n' +

     '    }\n\n' +

     '    self.typeParameters = function() {\n\n' +
                return {
                            useCustomDatasources: false,
                            maxDatasources: -1, //unlimited
                            maxDataKeys: -1, //unlimited
                            dataKeysOptional: false,
                            stateData: false
                       };
     '    }\n\n' +

     '    self.actionSources = function() {\n\n' +
                return {
                            'headerButton': {
                               name: 'Header button',
                               multiple: true
                            }
                        };
          }\n\n' +
     '    self.onResize = function() {\n\n' +

     '    }\n\n' +

     '    self.onEditModeChanged = function() {\n\n' +

     '    }\n\n' +

     '    self.onMobileModeChanged = function() {\n\n' +

     '    }\n\n' +

     '    self.getSettingsSchema = function() {\n\n' +

     '    }\n\n' +

     '    self.getDataKeySettingsSchema = function() {\n\n' +

     '    }\n\n' +

     '    self.onDestroy = function() {\n\n' +

     '    }\n\n' +
     '}';*/

    widgetTypeFunctionBody += widgetInfo.controllerScript;
    widgetTypeFunctionBody += '\n};\n';
    try {
        var widgetTypeFunction: any = new Function(widgetTypeFunctionBody);
        var widgetType: any = widgetTypeFunction.apply(this);
        var widgetTypeInstance: any = new widgetType();
        var result: any = {
            widgetTypeFunction: widgetType
        };
        if ((typeof widgetTypeInstance.getSettingsSchema === 'function')) {
            result.settingsSchema = widgetTypeInstance.getSettingsSchema();
        }
        if ((typeof widgetTypeInstance.getDataKeySettingsSchema === 'function')) {
            result.dataKeySettingsSchema = widgetTypeInstance.getDataKeySettingsSchema();
        }
        if ((typeof widgetTypeInstance.typeParameters === 'function')) {
            result.typeParameters = widgetTypeInstance.typeParameters();
        } else {
            result.typeParameters = {};
        }
        if ((typeof widgetTypeInstance.useCustomDatasources === 'function')) {
            result.typeParameters.useCustomDatasources = widgetTypeInstance.useCustomDatasources();
        } else {
            result.typeParameters.useCustomDatasources = false;
        }
        if ((result.typeParameters.maxDatasources === undefined)) {
            result.typeParameters.maxDatasources = -1;
        }
        if ((result.typeParameters.maxDataKeys === undefined)) {
            result.typeParameters.maxDataKeys = -1;
        }
        if ((result.typeParameters.dataKeysOptional === undefined)) {
            result.typeParameters.dataKeysOptional = false;
        }
        if ((result.typeParameters.stateData === undefined)) {
            result.typeParameters.stateData = false;
        }
        if ((typeof widgetTypeInstance.actionSources === 'function')) {
            result.actionSources = widgetTypeInstance.actionSources();
        } else {
            result.actionSources = {};
        }
        for (var actionSourceId in types.widgetActionSources) {
            result.actionSources[actionSourceId] = structuredClone(types.widgetActionSources[actionSourceId]);
            result.actionSources[actionSourceId].name = vm.translate.instant(result.actionSources[actionSourceId].name) + '';
        }

        return result;
    } catch (e: any) {
        vm.utils.processWidgetException(e);
        throw e;
    }
    return undefined;
  }

  processWidgetLoadError(errorMessages?: any, cacheKey?: any, deferred?: any, ...rest: any[]): any {
    var widgetInfo: any = structuredClone(this.errorWidgetType);
    for (var e in errorMessages) {
        var error: any = errorMessages[e];
        widgetInfo.templateHtml += '<div class="tb-widget-error-msg">' + error + '</div>';
    }
    widgetInfo.templateHtml += '</div>';
    deferred.resolve(widgetInfo);
    this.resolveWidgetsInfoFetchQueue(cacheKey, widgetInfo);
  }

  loadWidget(widgetType?: any, bundleAlias?: any, isSystem?: any, deferred?: any, ...rest: any[]): any {
    var widgetInfo: any = this.toWidgetInfo(widgetType);
    var key: any = this.createWidgetInfoCacheKey(bundleAlias, widgetInfo.alias, isSystem);
    this.loadWidgetResources(widgetInfo, bundleAlias, isSystem).then(
        () => {
            var widgetType: any = null;
            try {
                widgetType = this.createWidgetTypeFunction(widgetInfo, key);
            } catch (e: any) {
                var details: any = this.utils.parseException(e);
                var errorMessage: any = 'Failed to compile widget script. \n Error: ' + details.message;
                this.processWidgetLoadError([errorMessage], key, deferred);
            }
            if (widgetType) {
                if (widgetType.settingsSchema) {
                    widgetInfo.typeSettingsSchema = widgetType.settingsSchema;
                }
                if (widgetType.dataKeySettingsSchema) {
                    widgetInfo.typeDataKeySettingsSchema = widgetType.dataKeySettingsSchema;
                }
                widgetInfo.typeParameters = widgetType.typeParameters;
                widgetInfo.actionSources = widgetType.actionSources;
                this.putWidgetInfoToCache(widgetInfo, bundleAlias, widgetInfo.alias, isSystem);
                this.putWidgetTypeFunctionToCache(widgetType.widgetTypeFunction, bundleAlias, widgetInfo.alias, isSystem);
                deferred.resolve(widgetInfo);
                this.resolveWidgetsInfoFetchQueue(key, widgetInfo);
            }
        }, (errorMessages?: any) => {
            this.processWidgetLoadError(errorMessages, key, deferred);
        }
    );
  }

  getWidgetType(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/widgetType?isSystem=' + (isSystem ? 'true' : 'false') +
        '&bundleAlias='+bundleAlias+'&alias='+widgetTypeAlias;
    firstValueFrom(this.http.get(url, null)).then(function success(response?: any) {
        var widgetType: any = response;
        deferred.resolve(widgetType);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getWidgetTypeById(widgetTypeId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/widgetType/' + widgetTypeId;
    firstValueFrom(this.http.get(url, null)).then(function success(response?: any) {
        var widgetType: any = response;
        deferred.resolve(widgetType);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteWidgetType(bundleAlias?: any, widgetTypeAlias?: any, isSystem?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.getWidgetType(bundleAlias, widgetTypeAlias, isSystem).then(
        (widgetType?: any) => {
            var url: any = '/api/widgetType/' + widgetType.id.id;
            firstValueFrom(this.http.delete(url)).then(() => {
                this.deleteWidgetInfoFromCache(bundleAlias, widgetTypeAlias, isSystem);
                deferred.resolve();
            }, function fail() {
                deferred.reject();
            });
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  saveWidgetType(widgetInfo?: any, id?: any, bundleAlias?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var widgetType: any = this.toWidgetType(widgetInfo, id, undefined, bundleAlias);
    var url: any = '/api/widgetType';
    firstValueFrom(this.http.post(url, widgetType)).then((response?: any) => {
        var widgetType: any = response;
        this.deleteWidgetInfoFromCache(widgetType.bundleAlias, widgetType.alias, widgetType.tenantId.id === types.id.nullUid);
        deferred.resolve(widgetType);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  saveImportedWidgetType(widgetType?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/widgetType';
    firstValueFrom(this.http.post(url, widgetType)).then((response?: any) => {
        var widgetType: any = response;
        this.deleteWidgetInfoFromCache(widgetType.bundleAlias, widgetType.alias, widgetType.tenantId.id === types.id.nullUid);
        deferred.resolve(widgetType);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  loadWidgetResources(widgetInfo?: any, bundleAlias?: any, isSystem?: any, ...rest: any[]): any {

    var deferred: any = $q.defer();
    var errors: any = [];

    var widgetNamespace: any = "widget-type-" + (isSystem ? 'sys-' : '') + bundleAlias + '-' + widgetInfo.alias;
    this.cssParser.cssPreviewNamespace = widgetNamespace;
    this.cssParser.createStyleElement(widgetNamespace, widgetInfo.templateCss);

    function loadNextOrComplete(i?: any): any {
        i++;
        if (i < widgetInfo.resources.length) {
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
        var resourceUrl: any = widgetInfo.resources[i].url;
        if (resourceUrl && resourceUrl.length > 0) {
            $ocLazyLoad.load(resourceUrl).then(
                function success() {
                    loadNextOrComplete(i);
                },
                function fail() {
                    errors.push('Failed to load widget resource: \'' + resourceUrl + '\'');
                    loadNextOrComplete(i);
                }
            );
        } else {
            loadNextOrComplete(i);
        }
    }

    if (widgetInfo.resources.length > 0) {
        loadNext(0);
    } else {
        deferred.resolve();
    }

    return deferred.promise;
  }
}
