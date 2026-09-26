import { Component, OnInit, forwardRef, inject, input, model } from '@angular/core';
import { CreateEntityAliasFn, FetchDashboardStatesFn, FetchEntityKeysFn, GenerateDataKeyFn } from '../tb-datasource/datasource-callbacks';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RootState } from '../../../root-state';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { TbDatasourceDirective } from '../tb-datasource/tb-datasource.directive';
import { TbEntityAliasSelectDirective } from '../tb-entity-alias-select/tb-entity-alias-select.directive';
import { TbJsonFormDirective } from '../tb-json-form/tb-json-form.directive';
import { TbLegendConfigDirective } from '../tb-legend-config/tb-legend-config.directive';
import { TbManageWidgetActionsDirective } from '../tb-manage-widget-actions/tb-manage-widget-actions.directive';
import { TbMaterialIconSelectDirective } from '../tb-material-icon-select/tb-material-icon-select.directive';
import { TbTimewindowDirective } from '../tb-timewindow/tb-timewindow.directive';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/** Fields of the settings/data tabs whose change is written back into `config` / `layout` (the legacy combined watch). */
type ConfigField =
  | 'title' | 'showTitleIcon' | 'titleIcon' | 'iconColor' | 'iconSize' | 'titleTooltip' | 'showTitle'
  | 'dropShadow' | 'enableFullscreen' | 'backgroundColor' | 'color' | 'padding' | 'margin' | 'widgetStyle'
  | 'titleStyle' | 'mobileOrder' | 'mobileHeight' | 'units' | 'decimals' | 'useDashboardTimewindow'
  | 'displayTimewindow' | 'alarmSearchStatus' | 'alarmsPollingInterval' | 'alarmsMaxCountLoad'
  | 'alarmsFetchSize' | 'showLegend';

/**
 * Ported from the AngularJS directive `tbWidgetConfig` (module `thingsboard.directives.widgetConfig`) in src/app/components/widget/widget-config.directive.js:38.
 * The `ngModel` it required is the NgModelController base: `$render`, `$setViewValue`, `$setValidity`.
 */
@Component({
  selector: 'tb-widget-config',
  standalone: true,
  imports: [
    NgClass, FormsModule, TranslatePipe, MatTabsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatExpansionModule, MatButtonModule, MatIconModule, MatTooltipModule,
    forwardRef(() => TbTimewindowDirective), forwardRef(() => TbDatasourceDirective),
    forwardRef(() => TbEntityAliasSelectDirective), forwardRef(() => TbMaterialIconSelectDirective),
    forwardRef(() => TbLegendConfigDirective), forwardRef(() => TbJsonFormDirective),
    forwardRef(() => TbManageWidgetActionsDirective),
  ],
  templateUrl: './tb-widget-config.directive.html',
  providers: ngModelProviders(TbWidgetConfigDirective),
})
export class TbWidgetConfigDirective extends NgModelController implements OnInit {
  readonly forceExpandDatasources = model<any>();
  readonly isDataEnabled = model<any>();
  readonly widgetType = model<any>();
  readonly typeParameters = model<any>();
  readonly actionSources = model<any>();
  readonly widgetSettingsSchema = model<any>();
  readonly datakeySettingsSchema = model<any>();
  readonly aliasController = model<any>();
  readonly functionsOnly = model<any>();
  readonly fetchEntityKeys = input<FetchEntityKeysFn | undefined>();
  readonly fetchDashboardStates = input<FetchDashboardStatesFn | undefined>();
  readonly onCreateEntityAlias = input<CreateEntityAliasFn | undefined>();
  /** `generateDataKey(chip, type)` handed to the datasources (the legacy `generate-data-key` callback). */
  readonly generateDataKeyFn: GenerateDataKeyFn = (chip, type) => this.generateDataKey(chip, type);
  readonly theForm = model<any>();

  protected readonly rootScope = inject(RootState);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);

  protected readonly alarmSearchStatuses: string[] = Object.values(types.alarmSearchStatus as Record<string, string>);

  /** Passed to tb-json-form as its `formControl`: the nested `ng-form` of the legacy advanced tab. */
  protected readonly advancedForm = {
    $setDirty: () => {
      this.setFormDirty();
      this.onSettingsChange();
    },
    $setValidity: (key: string, valid: boolean) => {
      this.$setValidity(key, valid);
    },
  };

  types: any = types;
  widgetEditMode: any;
  emptySettingsSchema: any = {
            type: "object",
            properties: {}
        };
  emptySettingsGroupInfoes: any = [];
  defaultSettingsForm: any = [
            '*'
        ];
  currentSettingsSchema: any = {};
  currentSettings: any;
  currentSettingsGroupInfoes: any;
  targetDeviceAlias: any = {
            value: null
        };
  alarmSource: any = {
            value: null
        };
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

  constructor() {
    super();
    this.widgetEditMode = this.rootScope['widgetEditMode'];
    this.currentSettings = structuredClone(this.emptySettingsSchema);
    this.currentSettingsGroupInfoes = structuredClone(this.emptySettingsGroupInfoes);
  }

  ngOnInit(): void {
    if (this.forceExpandDatasources() === undefined) {
      this.forceExpandDatasources.set(false);
    }
    if (this.isDataEnabled() === undefined) {
      this.isDataEnabled.set(true);
    }
  }

  /** Legacy `ngModelCtrl.$render`. */
  override $render(): void {
    const viewValue = this.$viewValue;
    if (viewValue) {
      var config: any = viewValue.config;
      var layout: any = viewValue.layout;
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
            JSON.stringify((config.widgetStyle !== undefined) ? config.widgetStyle : {}, null, 2);
        this.titleStyle =
            JSON.stringify((config.titleStyle !== undefined) ? config.titleStyle : {
                fontSize: '16px',
                fontWeight: 400
            }, null, 2);
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
      this.updateValidity();
    }
  }

  /** One field of the legacy combined watch changed: set it, then write every field back. */
  setField(field: ConfigField, value: any): void {
    (this as any)[field] = value;
    this.onConfigChange();
  }

  /** Legacy combined `$watch('title + showTitleIcon + …')`. */
  onConfigChange(): void {
    if (this.$viewValue) {
        var value: any = this.$viewValue;
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
        this.emitValue(value);
        this.updateValidity();
    }
  }

  /** Legacy `$watch('currentSettings', …, true)`. */
  onSettingsChange(): void {
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        if (value.config) {
            value.config.settings = this.currentSettings;
            this.emitValue(value);
        }
    }
  }

  /** Legacy `$watch('timewindow', …, true)`. */
  onTimewindowChange(timewindow: any): void {
    this.timewindow = timewindow;
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        if (value.config) {
            value.config.timewindow = this.timewindow;
            this.emitValue(value);
        }
    }
  }

  /** Legacy `$watch('legendConfig', …, true)`. */
  onLegendConfigChange(legendConfig: any): void {
    this.legendConfig = legendConfig;
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        if (value.config) {
            value.config.legendConfig = this.legendConfig;
            this.emitValue(value);
        }
    }
  }

  /** Legacy `$watch('datasources', …, true)`. */
  onDatasourcesChange(): void {
    if (this.$viewValue && this.$viewValue.config
        && this.widgetType() !== this.typesRef.widgetType.rpc.value
        && this.widgetType() !== this.typesRef.widgetType.alarm.value
        && this.widgetType() !== this.typesRef.widgetType.static.value && this.isDataEnabled()) {
        var value: any = this.$viewValue;
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
        this.emitValue(value);
        this.updateValidity();
    }
  }

  /** Legacy `$watch('targetDeviceAlias.value', …)`. */
  onTargetDeviceAliasChange(alias: any): void {
    this.targetDeviceAlias.value = alias;
    if (this.$viewValue && this.$viewValue.config && this.widgetType() === this.typesRef.widgetType.rpc.value && this.isDataEnabled()) {
        var value: any = this.$viewValue;
        var config: any = value.config;
        if (this.targetDeviceAlias.value) {
            config.targetDeviceAliasIds = [this.targetDeviceAlias.value.id];
        } else {
            config.targetDeviceAliasIds = [];
        }
        this.emitValue(value);
        this.updateValidity();
    }
  }

  /** Legacy `$watch('alarmSource.value', …)`. */
  onAlarmSourceChange(alarmSource: any): void {
    this.alarmSource.value = alarmSource;
    if (this.$viewValue && this.$viewValue.config && this.widgetType() === this.typesRef.widgetType.alarm.value && this.isDataEnabled()) {
        var value: any = this.$viewValue;
        var config: any = value.config;
        if (this.alarmSource.value) {
            config.alarmSource = this.alarmSource.value;
        } else {
            config.alarmSource = null;
        }
        this.emitValue(value);
        this.updateValidity();
    }
  }

  /** Legacy `$watch('actions', …, true)`. */
  onActionsChange(actions: any): void {
    this.actions = actions;
    if (this.$viewValue && this.$viewValue.config) {
        var value: any = this.$viewValue;
        var config: any = value.config;
        config.actions = this.actions;
        this.emitValue(value);
        this.updateValidity();
    }
  }

  /** Legacy `ngModelCtrl.$setViewValue(value)`. */
  private emitValue(value: any): void {
    this.$setViewValue(value);
    this.$setTouched();
  }

  private setFormDirty(): void {
    const form = this.theForm();
    if (form && typeof form.$setDirty === 'function') {
      form.$setDirty();
    }
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
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        var config: any = value.config;
        if (config) {
            var valid: any;
            if (this.widgetType() === this.typesRef.widgetType.rpc.value && this.isDataEnabled()) {
                valid = config && config.targetDeviceAliasIds && config.targetDeviceAliasIds.length > 0;
                this.$setValidity('targetDeviceAliasIds', valid);
            } else if (this.widgetType() === this.typesRef.widgetType.alarm.value && this.isDataEnabled()) {
                valid = config && config.alarmSource;
                this.$setValidity('alarmSource', valid);
            } else if (this.widgetType() !== this.typesRef.widgetType.static.value && this.isDataEnabled()) {
                valid = config && config.datasources && config.datasources.length > 0;
                this.$setValidity('datasources', valid);
            }
            try {
                JSON.parse(this.widgetStyle);
                this.$setValidity('widgetStyle', true);
            } catch (e: any) {
                this.$setValidity('widgetStyle', false);
            }
            try {
                JSON.parse(this.titleStyle);
                this.$setValidity('titleStyle', true);
            } catch (e: any) {
                this.$setValidity('titleStyle', false);
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
    this.setFormDirty();
    this.onDatasourcesChange();
  }

  removeDatasource($event?: any, datasource?: any, ...rest: any[]): any {
    var index: any = this.datasources.indexOf(datasource);
    if (index > -1) {
        this.datasources.splice(index, 1);
        this.setFormDirty();
        this.onDatasourcesChange();
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
    var value: any = this.$viewValue;
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
    var value: any = this.$viewValue;
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
