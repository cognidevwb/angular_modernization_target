import { Component, inject, model, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import tinycolor from 'tinycolor2';
import $ from 'jquery';
import datasourceFuncTemplate from '../../../../app/components/datasource-func.tpl.html';
import datakeyConfigDialogTemplate from '../../../../app/components/datakey-config-dialog.tpl.html';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $mdColorPicker: any;
declare let $templateCache: any;
declare let $window: any;
declare let angular: any;
declare let scope: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbDatasourceFunc` (module `thingsboard.directives.datasourceFunc`) in src/app/components/datasource-func.directive.js:34.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datasource-func',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbDatasourceFuncDirective {
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

  protected template: any = datasourceFuncTemplate;
  ngModelCtrl: any = ngModelCtrl;
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
    $(this.element.nativeElement).html(this.template);
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
            if (ngModelCtrl.$viewValue) {
                ngModelCtrl.$viewValue.name = this.datasourceName;
                this.updateValidity();
            }
        });
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                var funcDataKeys: any = [];
                var alarmDataKeys: any = [];
                if (ngModelCtrl.$viewValue.dataKeys) {
                    for (var d: any=0;d<ngModelCtrl.$viewValue.dataKeys.length;d++) {
                        var dataKey: any = ngModelCtrl.$viewValue.dataKeys[d];
                        if (dataKey.type === this.typesRef.dataKeyType.function) {
                            funcDataKeys.push(dataKey);
                        } else if (dataKey.type === this.typesRef.dataKeyType.alarm) {
                            alarmDataKeys.push(dataKey);
                        }
                    }
                }
                this.funcDataKeys = funcDataKeys;
                this.alarmDataKeys = alarmDataKeys;
                this.datasourceName = ngModelCtrl.$viewValue.name;
            }
        };
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateValidity(...rest: any[]): any {
    if (ngModelCtrl.$viewValue) {
        var value: any = ngModelCtrl.$viewValue;
        var dataValid: any = (value !== undefined) && value != null;
        ngModelCtrl.$setValidity('deviceData', dataValid);
        if (dataValid) {
            if (this.optDataKeys()) {
                ngModelCtrl.$setValidity('datasourceKeys', true);
            } else {
                ngModelCtrl.$setValidity('datasourceKeys',
                    (value.dataKeys !== undefined) &&
                    value.dataKeys != null &&
                    value.dataKeys.length > 0);
            }
        }
    }
  }

  updateDataKeys(...rest: any[]): any {
    if (ngModelCtrl.$viewValue) {
        var dataKeys: any = [];
        dataKeys = dataKeys.concat(this.funcDataKeys);
        dataKeys = dataKeys.concat(this.alarmDataKeys);
        if (ngModelCtrl.$viewValue.dataKeys != dataKeys)
        {
           ngModelCtrl.$setDirty();
           ngModelCtrl.$viewValue.dataKeys = dataKeys;
        }
        this.updateValidity();
    }
  }

  transformFuncDataKeyChip(chip?: any, ...rest: any[]): any {
    if (this.maxDataKeys() > 0 && ngModelCtrl.$viewValue.dataKeys.length >= this.maxDataKeys() ) {
        return null;
    } else {
        return this.generateDataKey.emit({chip: chip, type: this.typesRef.dataKeyType.function});
    }
    return undefined;
  }

  transformAlarmDataKeyChip(chip?: any, ...rest: any[]): any {
    return this.generateDataKey.emit({chip: chip, type: this.typesRef.dataKeyType.alarm});
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

    }).then(function (color?: any) {
        dataKey.color = color;
        ngModelCtrl.$setDirty();
    });
  }

  editDataKey(event?: any, dataKey?: any, ...rest: any[]): any {
    let vm = this;

    this.dialog.show({
        controller: 'DatakeyConfigDialogController',
        controllerAs: 'vm',
        templateUrl: datakeyConfigDialogTemplate,
        locals: {
            dataKey: structuredClone(dataKey),
            dataKeySettingsSchema: this.datakeySettingsSchema(),
            entityAlias: null,
            aliasController: null
        },
        parent: $(this.document.body),
        fullscreen: true,
        targetEvent: event,
        multiple: true,
        onComplete: (...rest: any[]) => {
            var w: any = $($window);
            w.triggerHandler('resize');
        }
    }).then((newDataKey?: any) => {
        if (newDataKey.type === this.typesRef.dataKeyType.function) {
            let index: any = this.funcDataKeys.indexOf(dataKey);
            this.funcDataKeys[index] = newDataKey;
        } else if (newDataKey.type === this.typesRef.dataKeyType.alarm) {
            let index: any = this.alarmDataKeys.indexOf(dataKey);
            this.alarmDataKeys[index] = newDataKey;
        }
        ngModelCtrl.$setDirty();
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
    var lowercaseQuery: any = angular.lowercase(query);
    return function filterFn(dataKey?: any) {
        return (angular.lowercase(dataKey).indexOf(lowercaseQuery) === 0);
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
