import { Component, inject, model, output, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import tinycolor from 'tinycolor2';
import $ from 'jquery';
import { firstValueFrom } from 'rxjs';
import { DatakeyConfigDialogComponent } from '../datakey-config-dialog/datakey-config-dialog.component';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $templateCache: any;
declare let $window: any;
declare let scope: any;

/**
 * Ported from the AngularJS directive `tbDatasourceFunc` (module `thingsboard.directives.datasourceFunc`) in src/app/components/datasource-func.directive.js:34.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datasource-func',
  standalone: true,
  template: '', // TODO(port): no template found
  providers: ngModelProviders(TbDatasourceFuncDirective),
})
export class TbDatasourceFuncDirective extends NgModelController {
  readonly widgetType = model<any>();
  readonly maxDataKeys = model<any>();
  readonly optDataKeys = model<any>();
  readonly generateDataKey = output<any>();
  readonly datakeySettingsSchema = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$mdColorPicker' — an AngularJS built-in with no Angular counterpart
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);

  types: any;
  functionTypes: any;
  alarmFields: any = [];
  selectedDataKey: any = null;
  dataKeySearchText: any = null;
  selectedAlarmDataKey: any = null;
  alarmDataKeySearchText: any = null;
  $watch: any;
  alarmDataKeys: any;
  datasourceName: any;
  funcDataKeys: any;

  // TODO(port): `scope.generateDataKey(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    this.types = this.typesRef;
    this.functionTypes = this.utils.getPredefinedFunctionsList();
    for (var alarmField in this.typesRef.alarmFields) {
            this.alarmFields.push(alarmField);
        }
    effect(() => {
            this.updateDataKeys();
        });
    this.$watch('alarmDataKeys', () => {
            this.updateDataKeys();
        }, true);
    this.$watch('datasourceName', () => {
            if (this.$viewValue) {
                this.$viewValue.name = this.datasourceName;
                this.updateValidity();
            }
        });
  }

  override $render(): void {
    if (this.$viewValue) {
        var funcDataKeys: any = [];
        var alarmDataKeys: any = [];
        if (this.$viewValue.dataKeys) {
            for (var d: any=0;d<this.$viewValue.dataKeys.length;d++) {
                var dataKey: any = this.$viewValue.dataKeys[d];
                if (dataKey.type === this.typesRef.dataKeyType.function) {
                    funcDataKeys.push(dataKey);
                } else if (dataKey.type === this.typesRef.dataKeyType.alarm) {
                    alarmDataKeys.push(dataKey);
                }
            }
        }
        this.funcDataKeys = funcDataKeys;
        this.alarmDataKeys = alarmDataKeys;
        this.datasourceName = this.$viewValue.name;
    }
  }

  updateValidity(...rest: any[]): any {
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        var dataValid: any = (value !== undefined) && value != null;
        this.$setValidity('deviceData', dataValid);
        if (dataValid) {
            if (this.optDataKeys()) {
                this.$setValidity('datasourceKeys', true);
            } else {
                this.$setValidity('datasourceKeys',
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
        dataKeys = dataKeys.concat(this.funcDataKeys);
        dataKeys = dataKeys.concat(this.alarmDataKeys);
        if (this.$viewValue.dataKeys != dataKeys)
        {
           this.$setDirty();
           this.$viewValue.dataKeys = dataKeys;
        }
        this.updateValidity();
    }
  }

  transformFuncDataKeyChip(chip?: any, ...rest: any[]): any {
    if (this.maxDataKeys() > 0 && this.$viewValue.dataKeys.length >= this.maxDataKeys() ) {
        return null;
    } else {
        return this.generateDataKey.emit({chip: chip, type: this.typesRef.dataKeyType.function});
    }
    return undefined;
  }

  transformAlarmDataKeyChip(chip?: any, ...rest: any[]): any {
    return this.generateDataKey.emit({chip: chip, type: this.typesRef.dataKeyType.alarm});
  }

  // TODO(port): '$mdColorPicker' — an AngularJS Material color-picker add-on with no Angular counterpart; use the browser's native color input instead
  showColorPicker(event?: any, dataKey?: any, ...rest: any[]): any {
    const input = this.document.createElement('input');
    input.type = 'color';
    input.value = tinycolor(dataKey.color || '#fff').toHexString();
    input.style.display = 'none';
    this.document.body.appendChild(input);
    input.addEventListener('change', () => {
        dataKey.color = input.value;
        this.$setDirty();
        input.remove();
    });
    input.click();
  }

  editDataKey(event?: any, dataKey?: any, ...rest: any[]): any {
    let vm = this;

    firstValueFrom(this.dialog.open(DatakeyConfigDialogComponent, {
        data: {
            dataKey: structuredClone(dataKey),
            dataKeySettingsSchema: this.datakeySettingsSchema(),
            entityAlias: null,
            aliasController: null
        },
        panelClass: 'tb-dialog'
    }).afterClosed()).then((newDataKey?: any) => {
        if (newDataKey === undefined) {
            return Promise.reject();
        }
        return newDataKey;
    }).then((newDataKey?: any) => {
        if (newDataKey.type === this.typesRef.dataKeyType.function) {
            let index: any = this.funcDataKeys.indexOf(dataKey);
            this.funcDataKeys[index] = newDataKey;
        } else if (newDataKey.type === this.typesRef.dataKeyType.alarm) {
            let index: any = this.alarmDataKeys.indexOf(dataKey);
            this.alarmDataKeys[index] = newDataKey;
        }
        this.$setDirty();
    }, function () {
    });
  }

  textIsNotEmpty(text?: any, ...rest: any[]): any {
    return (text && text != null && text.length > 0) ? true : false;
  }

  dataKeysSearch(dataKeySearchText?: any, ...rest: any[]): any {
    var targetKeys: any = this.widgetType() == this.typesRef.widgetType.alarm.value ? this.alarmFields : this.functionTypes;
    var dataKeys: any = dataKeySearchText ? targetKeys.filter(
        this.createFilterForDataKey(dataKeySearchText)) : targetKeys;
    return dataKeys;
  }

  createFilterForDataKey(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = query.toLowerCase();
    return function filterFn(dataKey?: any) {
        return (dataKey.toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  createKey(event?: any, chipsId?: any, ...rest: any[]): any {
    var chipsChild: any = $(chipsId, $(this.element.nativeElement))[0].firstElementChild;
    var el: any = $(chipsChild);
    var chipBuffer: any = el.scope().$mdChipsCtrl.getChipBuffer();
    event.preventDefault();
    event.stopPropagation();
    el.scope().$mdChipsCtrl.appendChip(chipBuffer.trim());
    el.scope().$mdChipsCtrl.resetChipBuffer();
  }
}
