import { Component, inject, model, output, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import tinycolor from 'tinycolor2';
import $ from 'jquery';
import { isEqual } from 'lodash-es';
import { DatakeyConfigDialogComponent } from '../datakey-config-dialog/datakey-config-dialog.component';
import { $q } from '../../../core/q';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
const datasourceEntityTemplate = '../../../../app/components/datasource-entity.tpl.html';
const datakeyConfigDialogTemplate = '../../../../app/components/datakey-config-dialog.tpl.html';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $mdColorPicker: any;
declare let $templateCache: any;
declare let $window: any;
declare let scope: any;

/**
 * Ported from the AngularJS directive `tbDatasourceEntity` (module `thingsboard.directives.datasourceEntity`) in src/app/components/datasource-entity.directive.js:34.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 5 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datasource-entity',
  standalone: true,
  template: '', // TODO(port): no template found
  providers: ngModelProviders(TbDatasourceEntityDirective),
})
export class TbDatasourceEntityDirective extends NgModelController {
  readonly widgetType = model<any>();
  readonly maxDataKeys = model<any>();
  readonly optDataKeys = model<any>();
  readonly aliasController = model<any>();
  readonly datakeySettingsSchema = model<any>();
  readonly generateDataKey = output<any>();
  readonly fetchEntityKeys = output<any>();
  readonly onCreateEntityAlias = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$mdColorPicker' — an AngularJS built-in with no Angular counterpart
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);

  protected template: any = datasourceEntityTemplate;
  types: any;
  alarmFields: any = [];
  selectedDataKey: any = null;
  dataKeySearchText: any = null;
  selectedAlarmDataKey: any = null;
  alarmDataKeySearchText: any = null;
  $watch: any;
  alarmDataKeys: any;
  dataKeys: any;
  entityAlias: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `scope.fetchEntityKeys(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): `scope.generateDataKey(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    for (var alarmField in this.typesRef.alarmFields) {
            this.alarmFields.push(alarmField);
        }
    effect(() => {
      const entityAliasVal = this.entityAlias;
            if (this.$viewValue) {
                if (entityAliasVal) {
                    this.$viewValue.entityAliasId = entityAliasVal.id;
                } else {
                    this.$viewValue.entityAliasId = null;
                }
                this.updateValidity();
                this.selectedEntityAliasChange();
            }
        });
    effect(() => {
      this.dataKeys;
            this.updateDataKeys();
        });
    effect(() => {
      this.alarmDataKeys;
            this.updateDataKeys();
        });
    $(this.element.nativeElement).contents();
  }

  override $render(): void {
    if (this.$viewValue) {
      var entityAliasId: any = this.$viewValue.entityAliasId;
      var entityAliases: any = this.aliasController().getEntityAliases();
      if (entityAliases[entityAliasId]) {
        this.entityAlias = entityAliases[entityAliasId];
      } else {
        this.entityAlias = null;
      }
      var dataKeys: any = [];
      var alarmDataKeys: any = [];
      for (var d in this.$viewValue.dataKeys) {
        var dataKey: any = this.$viewValue.dataKeys[d];
        if ((dataKey.type === this.typesRef.dataKeyType.timeseries) || (dataKey.type === this.typesRef.dataKeyType.attribute) || (dataKey.type === this.typesRef.dataKeyType.entityField)) {
          dataKeys.push(dataKey);
        } else if (dataKey.type === this.typesRef.dataKeyType.alarm) {
          alarmDataKeys.push(dataKey);
        }
      }
      this.dataKeys = dataKeys;
      this.alarmDataKeys = alarmDataKeys;
    }
  }

  updateValidity(...rest: any[]): any {
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        var dataValid: any = (value !== undefined) && value != null;
        this.$setValidity('entityData', dataValid);
        if (dataValid) {
            this.$setValidity('entityAlias',
                (value.entityAliasId !== undefined) &&
                value.entityAliasId != null);
            if (this.optDataKeys()) {
                this.$setValidity('entityKeys', true);
            } else {
                this.$setValidity('entityKeys',
                    (value.dataKeys !== undefined) &&
                    value.dataKeys != null &&
                    value.dataKeys.length > 0);
            }
        }
    }
  }

  updateDataKeys(...rest: any[]): any {
    if (this.$viewValue) {
        var dataKeys: any = [];
        dataKeys = dataKeys.concat(this.dataKeys);
        dataKeys = dataKeys.concat(this.alarmDataKeys);
        if (!isEqual(this.$viewValue.dataKeys, dataKeys))
        {
           this.$setDirty();
           this.$viewValue.dataKeys = dataKeys;
        }
        this.updateValidity();
    }
  }

  textIsNotEmpty(text?: any, ...rest: any[]): any {
    return (text && text != null && text.length > 0) ? true : false;
  }

  selectedEntityAliasChange(...rest: any[]): any {
    if (!this.dataKeySearchText || this.dataKeySearchText === '') {
        this.dataKeySearchText = this.dataKeySearchText === '' ? null : '';
    }
    if (!this.alarmDataKeySearchText || this.alarmDataKeySearchText === '') {
        this.alarmDataKeySearchText = this.alarmDataKeySearchText === '' ? null : '';
    }
  }

  transformDataKeyChip(chip?: any, ...rest: any[]): any {
    if (this.maxDataKeys() > 0 && this.$viewValue.dataKeys.length >= this.maxDataKeys() ) {
        return null;
    } else {
        if (chip.type) {
            return this.generateDataKey.emit({chip: chip.name, type: chip.type});
        } else {
            if (this.widgetType() != this.typesRef.widgetType.latest.value) {
                return this.generateDataKey.emit({chip: chip, type: this.typesRef.dataKeyType.timeseries});
            } else {
                return null;
            }
        }
    }
    return undefined;
  }

  transformAlarmDataKeyChip(chip?: any, ...rest: any[]): any {
    if (chip.type) {
        return this.generateDataKey.emit({chip: chip.name, type: chip.type});
    } else {
        return this.generateDataKey.emit({chip: chip, type: this.typesRef.dataKeyType.alarm});
    }
    return undefined;
  }

  showColorPicker(event?: any, dataKey?: any, ...rest: any[]): any {
    $mdColorPicker.show({
        value: dataKey.color,
        defaultValue: '#fff',
        random: tinycolor.random(),
        clickOutsideToClose: false,
        hasBackdrop: false,
        multiple: true,
        preserveScope: false,

        mdColorAlphaChannel: true,
        mdColorSpectrum: true,
        mdColorSliders: true,
        mdColorGenericPalette: false,
        mdColorMaterialPalette: true,
        mdColorHistory: false,
        mdColorDefaultTab: 2,

        $event: event

    }).then((color?: any) => {
        dataKey.color = color;
        this.$setDirty();
    });
  }

  editDataKey(event?: any, dataKey?: any, ...rest: any[]): any {
    let vm = this;

    this.dialog.open(DatakeyConfigDialogComponent, {
        data: {
            dataKey: structuredClone(dataKey),
            dataKeySettingsSchema: this.datakeySettingsSchema(),
            entityAlias: this.entityAlias,
            aliasController: this.aliasController()
        },
        panelClass: ['tb-fullscreen-dialog'],
    }).afterClosed().subscribe((newDataKey?: any) => {
        if (!newDataKey) {
          return;
        }
        if ((newDataKey.type === this.typesRef.dataKeyType.timeseries) || (newDataKey.type === this.typesRef.dataKeyType.attribute) || (newDataKey.type === this.typesRef.dataKeyType.entityField)) {
            let index: any = this.dataKeys.indexOf(dataKey);
            this.dataKeys[index] = newDataKey;
        } else if (newDataKey.type === this.typesRef.dataKeyType.alarm) {
            let index: any = this.alarmDataKeys.indexOf(dataKey);
            this.alarmDataKeys[index] = newDataKey;
        }
        this.$setDirty();
        var w: any = $(window);
        w.triggerHandler('resize');
    });
  }

  dataKeysSearch(searchText?: any, ...rest: any[]): any {
         if (this.widgetType() == this.typesRef.widgetType.alarm.value) {
             var dataKeys: any = searchText ? this.alarmFields.filter(
                 this.createFilterForDataKey(searchText)) : this.alarmFields;
             return dataKeys;
         } else {
             if (this.entityAlias) {
                 var deferred: any = $q.defer();
                 this.fetchEntityKeys.emit({entityAliasId: this.entityAlias.id, query: searchText, type: this.typesRef.dataKeyType.timeseries})
                 this.fetchEntityKeys.emit({entityAliasId: this.entityAlias.id, query: searchText, type: this.typesRef.dataKeyType.timeseries} as any)
                 return deferred.promise;
             } else {
                 return Promise.resolve([]);
             }
         }
         return undefined;
  }

  createFilterForDataKey(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = query.toLowerCase();
    return function filterFn(dataKey?: any) {
        return (dataKey.toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  createKey(event?: any, type?: any, chipsId?: any, ...rest: any[]): any {
    var chipsChild: any = $(chipsId, $(this.element.nativeElement))[0].firstElementChild;
    var el: any = $(chipsChild);
    var chipBuffer: any = el.scope().$mdChipsCtrl.getChipBuffer();
    event.preventDefault();
    event.stopPropagation();
    el.scope().$mdChipsCtrl.appendChip({ name: chipBuffer.trim(), type: type});
    el.scope().$mdChipsCtrl.resetChipBuffer();
  }
}
