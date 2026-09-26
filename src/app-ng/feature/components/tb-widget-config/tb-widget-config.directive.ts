import { Component, inject, model, output, effect } from '@angular/core';
import { ElementRef } from '@angular/core';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import fixAceEditor from '../../../../app/components/ace-editor-fix';
// @ts-ignore
import widgetConfigTemplate from '../../../../app/components/widget/widget-config.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbWidgetConfig` (module `thingsboard.directives.widgetConfig`) in src/app/components/widget/widget-config.directive.js:38.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-widget-config',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbWidgetConfigDirective {
  readonly forceExpandDatasources = model<any>();
  readonly isDataEnabled = model<any>();
  readonly widgetType = model<any>();
  readonly typeParameters = model<any>();
  readonly actionSources = model<any>();
  readonly widgetSettingsSchema = model<any>();
  readonly datakeySettingsSchema = model<any>();
  readonly aliasController = model<any>();
  readonly functionsOnly = model<any>();
  readonly fetchEntityKeys = output<any>();
  readonly fetchDashboardStates = output<any>();
  readonly onCreateEntityAlias = output<any>();
  readonly theForm = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly rootScope = inject(RootState);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(widgetConfigTemplate);
  types: any;
  widgetEditMode: any;
  emptySettingsSchema: any = {
            type: "object",
            properties: {}
        };
  emptySettingsGroupInfoes: any = [];
  defaultSettingsForm: any = [
            '*'
        ];
  styleEditorOptions: any = {
            useWrapMode: true,
            mode: 'json',
            advanced: {
                enableSnippets: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            },
            onLoad: function (_ace?: any, ...rest: any[]) {
                fixAceEditor(_ace);
            }
        };
  currentSettingsSchema: any = {};
  currentSettings: any;
  currentSettingsGroupInfoes: any;
  targetDeviceAlias: any = {
            value: null
        };
  alarmSource: any = {
            value: null
        };
  $watch: any;
  actions: any;
  alarmSearchStatus: any;
  alarmsFetchSize: any;
  alarmsMaxCountLoad: any;
  alarmsPollingInterval: any;
  backgroundColor: any;
  color: any;
  currentSettingsForm: any;
  datasources: any;
  decimals: any;
  displayTimewindow: any;
  dropShadow: any;
  enableFullscreen: any;
  iconColor: any;
  iconSize: any;
  legendConfig: any;
  margin: any;
  mobileHeight: any;
  mobileOrder: any;
  padding: any;
  selectedTab: any;
  settings: any;
  showLegend: any;
  showTitle: any;
  showTitleIcon: any;
  timewindow: any;
  title: any;
  titleIcon: any;
  titleStyle: any;
  titleTooltip: any;
  units: any;
  useDashboardTimewindow: any;
  widgetStyle: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.widgetEditMode = this.rootScope.widgetEditMode;
    if ((this.forceExpandDatasources === undefined)) {
            this.forceExpandDatasources.set(false);
        }
    if ((this.isDataEnabled === undefined)) {
            this.isDataEnabled.set(true);
        }
    this.currentSettings = structuredClone(this.emptySettingsSchema);
    this.currentSettingsGroupInfoes = structuredClone(this.emptySettingsGroupInfoes);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                var config: any = ngModelCtrl.$viewValue.config;
                var layout: any = ngModelCtrl.$viewValue.layout;
                if (config) {
                    this.selectedTab = 0;
                    this.title = config.title;
                    this.showTitleIcon = (config.showTitleIcon !== undefined) ? config.showTitleIcon : false;
                    this.titleIcon = (config.titleIcon !== undefined) ? config.titleIcon : '';
                    this.iconColor = (config.iconColor !== undefined) ? config.iconColor : 'rgba(0, 0, 0, 0.87)';
                    this.iconSize = (config.iconSize !== undefined) ? config.iconSize : '24px';
                    this.titleTooltip = (config.titleTooltip !== undefined) ? config.titleTooltip : '';
                    this.showTitle = config.showTitle;
                    this.dropShadow = (config.dropShadow !== undefined) ? config.dropShadow : true;
                    this.enableFullscreen = (config.enableFullscreen !== undefined) ? config.enableFullscreen : true;
                    this.backgroundColor = config.backgroundColor;
                    this.color = config.color;
                    this.padding = config.padding;
                    this.margin = config.margin;
                    this.widgetStyle =
                        JSON.stringify((config.widgetStyle !== undefined) ? config.widgetStyle : {}, true);
                    this.titleStyle =
                        JSON.stringify((config.titleStyle !== undefined) ? config.titleStyle : {
                            fontSize: '16px',
                            fontWeight: 400
                        }, true);
                    this.units = config.units;
                    this.decimals = config.decimals;
                    this.useDashboardTimewindow = (config.useDashboardTimewindow !== undefined) ?
                        config.useDashboardTimewindow : true;
                    this.displayTimewindow = (config.displayTimewindow !== undefined) ?
                        config.displayTimewindow : true;
                    this.timewindow = config.timewindow;
                    this.showLegend = (config.showLegend !== undefined) ?
                        config.showLegend : this.widgetType() === this.typesRef.widgetType.timeseries.value;
                    this.legendConfig = config.legendConfig;
                    this.actions = config.actions;
                    if (!this.actions) {
                        this.actions = {};
                    }
                    if (this.widgetType() !== this.typesRef.widgetType.rpc.value &&
                        this.widgetType() !== this.typesRef.widgetType.alarm.value &&
                        this.widgetType() !== this.typesRef.widgetType.static.value
                        && this.isDataEnabled()) {
                        if (this.datasources) {
                            this.datasources.splice(0, this.datasources.length);
                        } else {
                            this.datasources = [];
                        }
                        if (config.datasources) {
                            for (var i: any = 0; i < config.datasources.length; i++) {
                                this.datasources.push({value: config.datasources[i]});
                            }
                        }
                    } else if (this.widgetType() === this.typesRef.widgetType.rpc.value && this.isDataEnabled()) {
                        if (config.targetDeviceAliasIds && config.targetDeviceAliasIds.length > 0) {
                            var aliasId: any = config.targetDeviceAliasIds[0];
                            var entityAliases: any = this.aliasController().getEntityAliases();
                            if (entityAliases[aliasId]) {
                                this.targetDeviceAlias.value = entityAliases[aliasId];
                            } else {
                                this.targetDeviceAlias.value = null;
                            }
                        } else {
                            this.targetDeviceAlias.value = null;
                        }
                    } else if (this.widgetType() === this.typesRef.widgetType.alarm.value && this.isDataEnabled()) {
                        this.alarmSearchStatus = (config.alarmSearchStatus !== undefined) ?
                            config.alarmSearchStatus : this.typesRef.alarmSearchStatus.any;
                        this.alarmsPollingInterval = (config.alarmsPollingInterval !== undefined) ?
                            config.alarmsPollingInterval : 5;
                        this.alarmsMaxCountLoad = (config.alarmsMaxCountLoad !== undefined) ?
                            config.alarmsMaxCountLoad : 0;
                        this.alarmsFetchSize = (config.alarmsFetchSize !== undefined) ?
                            config.alarmsFetchSize : 100;
                        if (config.alarmSource) {
                            this.alarmSource.value = config.alarmSource;
                        } else {
                            this.alarmSource.value = null;
                        }
                    }

                    this.settings = config.settings;

                    this.updateSchemaForm();
                }
                if (layout) {
                    this.mobileOrder = layout.mobileOrder;
                    this.mobileHeight = layout.mobileHeight;
                }
            }
        };
    effect(() => {
            if (this.modelValue) {
                var value: any = this.modelValue;
                if (value.config) {
                    var config: any = value.config;
                    config.title = this.title;
                    config.showTitleIcon = this.showTitleIcon;
                    config.titleIcon = this.titleIcon;
                    config.iconColor = this.iconColor;
                    config.iconSize = this.iconSize;
                    config.titleTooltip = this.titleTooltip;
                    config.showTitle = this.showTitle;
                    config.dropShadow = this.dropShadow;
                    config.enableFullscreen = this.enableFullscreen;
                    config.backgroundColor = this.backgroundColor;
                    config.color = this.color;
                    config.padding = this.padding;
                    config.margin = this.margin;
                    try {
                        config.widgetStyle = JSON.parse(this.widgetStyle);
                    } catch (e: any) {
                        config.widgetStyle = {};
                    }
                    try {
                        config.titleStyle = JSON.parse(this.titleStyle);
                    } catch (e: any) {
                        config.titleStyle = {};
                    }
                    config.units = this.units;
                    config.decimals = this.decimals;
                    config.useDashboardTimewindow = this.useDashboardTimewindow;
                    config.displayTimewindow = this.displayTimewindow;
                    config.alarmSearchStatus = this.alarmSearchStatus;
                    config.alarmsPollingInterval = this.alarmsPollingInterval;
                    config.alarmsMaxCountLoad = this.alarmsMaxCountLoad;
                    config.alarmsFetchSize = this.alarmsFetchSize;
                    config.showLegend = this.showLegend;
                }
                if (value.layout) {
                    var layout: any = value.layout;
                    layout.mobileOrder = (typeof this.mobileOrder === 'number') ? this.mobileOrder : undefined;
                    layout.mobileHeight = this.mobileHeight;
                }
                this.onChange(value);
                this.updateValidity();
            }
        });
    effect(() => {
            if (this.modelValue) {
                var value: any = this.modelValue;
                if (value.config) {
                    value.config.settings = this.currentSettings;
                    this.onChange(value);
                }
            }
        });
    this.$watch('timewindow', () => {
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                if (value.config) {
                    value.config.timewindow = this.timewindow;
                    ngModelCtrl.$setViewValue(value);
                }
            }
        }, true);
    this.$watch('legendConfig', () => {
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                if (value.config) {
                    value.config.legendConfig = this.legendConfig;
                    ngModelCtrl.$setViewValue(value);
                }
            }
        }, true);
    this.$watch('datasources', () => {
            if (ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.config
                && this.widgetType() !== this.typesRef.widgetType.rpc.value
                && this.widgetType() !== this.typesRef.widgetType.alarm.value
                && this.widgetType() !== this.typesRef.widgetType.static.value && this.isDataEnabled()) {
                var value: any = ngModelCtrl.$viewValue;
                var config: any = value.config;
                if (config.datasources) {
                    config.datasources.splice(0, config.datasources.length);
                } else {
                    config.datasources = [];
                }
                if (this.datasources) {
                    for (var i: any = 0; i < this.datasources.length; i++) {
                        config.datasources.push(this.datasources[i].value);
                    }
                }
                ngModelCtrl.$setViewValue(value);
                this.updateValidity();
            }
        }, true);
    effect(() => {
            if (this.modelValue && this.modelValue.config && this.widgetType() === this.typesRef.widgetType.rpc.value && this.isDataEnabled()) {
                var value: any = this.modelValue;
                var config: any = value.config;
                if (this.targetDeviceAlias.value) {
                    config.targetDeviceAliasIds = [this.targetDeviceAlias.value.id];
                } else {
                    config.targetDeviceAliasIds = [];
                }
                this.onChange(value);
                this.updateValidity();
            }
        });
    effect(() => {
            if (this.modelValue && this.modelValue.config && this.widgetType() === this.typesRef.widgetType.alarm.value && this.isDataEnabled()) {
                var value: any = this.modelValue;
                var config: any = value.config;
                if (this.alarmSource.value) {
                    config.alarmSource = this.alarmSource.value;
                } else {
                    config.alarmSource = null;
                }
                this.onChange(value);
                this.updateValidity();
            }
        });
    this.$watch('actions', () => {
            if (ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.config) {
                var value: any = ngModelCtrl.$viewValue;
                var config: any = value.config;
                config.actions = this.actions;
                ngModelCtrl.$setViewValue(value);
                this.updateValidity();
                /*if (scope.theForm) {
                    scope.theForm.$setDirty();
                }*/
            }
        }, true);
    $compile($(this.element.nativeElement).contents())(this);
  }

  displayAdvanced(...rest: any[]): any {
    return this.widgetSettingsSchema() && this.widgetSettingsSchema().schema;
  }

  updateSchemaForm(...rest: any[]): any {
    if (this.widgetSettingsSchema() && this.widgetSettingsSchema().schema) {
        this.currentSettingsSchema = this.widgetSettingsSchema().schema;
        this.currentSettingsForm = this.widgetSettingsSchema().form || structuredClone(this.defaultSettingsForm);
        this.currentSettingsGroupInfoes = this.widgetSettingsSchema().groupInfoes;
        this.currentSettings = this.settings;
    } else {
        this.currentSettingsForm = structuredClone(this.defaultSettingsForm);
        this.currentSettingsSchema = structuredClone(this.emptySettingsSchema);
        this.currentSettingsGroupInfoes = structuredClone(this.emptySettingsGroupInfoes);
        this.currentSettings = {};
    }
  }

  updateValidity(...rest: any[]): any {
    if (ngModelCtrl.$viewValue) {
        var value: any = ngModelCtrl.$viewValue;
        var config: any = value.config;
        if (config) {
            var valid: any;
            if (this.widgetType() === this.typesRef.widgetType.rpc.value && this.isDataEnabled()) {
                valid = config && config.targetDeviceAliasIds && config.targetDeviceAliasIds.length > 0;
                ngModelCtrl.$setValidity('targetDeviceAliasIds', valid);
            } else if (this.widgetType() === this.typesRef.widgetType.alarm.value && this.isDataEnabled()) {
                valid = config && config.alarmSource;
                ngModelCtrl.$setValidity('alarmSource', valid);
            } else if (this.widgetType() !== this.typesRef.widgetType.static.value && this.isDataEnabled()) {
                valid = config && config.datasources && config.datasources.length > 0;
                ngModelCtrl.$setValidity('datasources', valid);
            }
            try {
                JSON.parse(this.widgetStyle);
                ngModelCtrl.$setValidity('widgetStyle', true);
            } catch (e: any) {
                ngModelCtrl.$setValidity('widgetStyle', false);
            }
            try {
                JSON.parse(this.titleStyle);
                ngModelCtrl.$setValidity('titleStyle', true);
            } catch (e: any) {
                ngModelCtrl.$setValidity('titleStyle', false);
            }
        }
    }
  }

  addDatasource(...rest: any[]): any {
    var newDatasource: any;
    if (this.functionsOnly()) {
        newDatasource = structuredClone(this.utils.getDefaultDatasource(this.datakeySettingsSchema().schema));
        newDatasource.dataKeys = [this.generateDataKey('Sin', this.typesRef.dataKeyType.function)];
    } else {
        newDatasource = { type: this.typesRef.datasourceType.entity,
            dataKeys: []
        };
    }
    var datasource: any = {value: newDatasource};
    this.datasources.push(datasource);
    if (this.theForm()) {
        this.theForm().$setDirty();
    }
  }

  removeDatasource($event?: any, datasource?: any, ...rest: any[]): any {
    var index: any = this.datasources.indexOf(datasource);
    if (index > -1) {
        this.datasources.splice(index, 1);
        if (this.theForm()) {
            this.theForm().$setDirty();
        }
    }
  }

  generateDataKey(chip?: any, type?: any, ...rest: any[]): any {

    if (chip !== null && typeof chip === 'object') {
        chip._hash = Math.random();
        return chip;
    }

    var label: any = chip;
    if (type === this.typesRef.dataKeyType.alarm || type === this.typesRef.dataKeyType.entityField) {
        var keyField: any = type === this.typesRef.dataKeyType.alarm ? this.typesRef.alarmFields[chip] : this.typesRef.entityField[chip];
        if (keyField) {
            label = this.translate.instant(keyField.name)+'';
        }
    }
    label = this.genNextLabel(label);

    var result: any = {
        name: chip,
        type: type,
        label: label,
        color: this.genNextColor(),
        settings: {},
        _hash: Math.random()
    };

    if (type === this.typesRef.dataKeyType.function) {
        result.name = 'f(x)';
        result.funcBody = this.utils.getPredefinedFunctionBody(chip);
        if (!result.funcBody) {
            result.funcBody = "return prevValue + 1;";
        }
    }

    if ((this.datakeySettingsSchema().schema !== undefined)) {
        result.settings = this.utils.generateObjectFromJsonSchema(this.datakeySettingsSchema().schema);
    }

    return result;
  }

  genNextLabel(name?: any, ...rest: any[]): any {
    var label: any = name;
    var value: any = ngModelCtrl.$viewValue;
    var i: any = 1;
    var matches: any = false;
    do {
        matches = false;
        var datasources: any = this.widgetType() == this.typesRef.widgetType.alarm.value ? [value.config.alarmSource] : value.config.datasources;
        if (datasources) {
            for (var d: any=0;d<datasources.length;d++) {
                var datasource: any = datasources[d];
                if (datasource && datasource.dataKeys) {
                    for (var k: any = 0; k < datasource.dataKeys.length; k++) {
                        var dataKey: any = datasource.dataKeys[k];
                        if (dataKey.label === label) {
                            i++;
                            label = name + ' ' + i;
                            matches = true;
                        }
                    }
                }
            }
        }
    } while (matches);
    return label;
  }

  genNextColor(...rest: any[]): any {
    var i: any = 0;
    var value: any = ngModelCtrl.$viewValue;
    var datasources: any = this.widgetType() == this.typesRef.widgetType.alarm.value ? [value.config.alarmSource] : value.config.datasources;
    if (datasources) {
        for (var d: any=0;d<datasources.length;d++) {
            var datasource: any = datasources[d];
            if (datasource && datasource.dataKeys) {
                i += datasource.dataKeys.length;
            }
        }
    }
    return this.utils.getMaterialColor(i);
  }
}
