import { Component, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import datakeyConfigTemplate from '../../../../app/components/datakey-config.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbDatakeyConfig` (module `thingsboard.directives.datakeyConfig`) in src/app/components/datakey-config.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datakey-config',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbDatakeyConfigDirective {
  readonly entityAlias = model<any>();
  readonly fetchEntityKeys = output<any>();
  readonly datakeySettingsSchema = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(datakeyConfigTemplate);
  types: any;
  alarmFields: any = [];
  selectedKey: any = null;
  keySearchText: any = null;
  usePostProcessing: any = false;
  functions: any = {};
  $watch: any;
  dataKeyForm: any;
  dataKeySchema: any;
  model: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `scope.fetchEntityKeys(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    if (this.datakeySettingsSchema().schema) {
            this.dataKeySchema = this.datakeySettingsSchema().schema;
            this.dataKeyForm = this.datakeySettingsSchema().form || ['*'];
            this.template = '<md-tabs md-border-bottom class="tb-datakey-config">\n' +
                '<md-tab label="{{\'datakey.settings\' | translate}}">\n' +
                this.template +
                '</md-tab>\n' +
                '<md-tab label="{{\'datakey.advanced\' | translate}}">\n' +
                '<md-content class="md-padding" layout="column">\n' +
                '<div style="overflow: auto;">\n' +
                '<ng-form name="ngform" ' +
                'layout="column" ' +
                'layout-padding>' +
                '<tb-json-form schema="dataKeySchema"' +
                'form="dataKeyForm"' +
                'model="model.settings"' +
                'form-control="ngform">' +
                '</tb-json-form>' +
                '</ng-form>\n' +
                '</div>\n' +
                '</md-content>\n' +
                '</md-tab>\n' +
                '</md-tabs>';
        }
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    for (var alarmField in this.typesRef.alarmFields) {
            this.alarmFields.push(alarmField);
        }
    ngModelCtrl.$render = function () {
            this.model = {};
            if (ngModelCtrl.$viewValue) {
                this.model.type = ngModelCtrl.$viewValue.type;
                this.model.name = ngModelCtrl.$viewValue.name;
                this.model.label = ngModelCtrl.$viewValue.label;
                this.model.color = ngModelCtrl.$viewValue.color;
                this.model.units = ngModelCtrl.$viewValue.units;
                this.model.decimals = ngModelCtrl.$viewValue.decimals;
                this.model.funcBody = ngModelCtrl.$viewValue.funcBody;
                this.model.postFuncBody = ngModelCtrl.$viewValue.postFuncBody;
                this.model.usePostProcessing = this.model.postFuncBody ? true : false;
                this.model.settings = ngModelCtrl.$viewValue.settings;
            }
        };
    this.$watch('model', (newVal?: any, oldVal?: any) => {
            if (newVal.usePostProcessing != oldVal.usePostProcessing) {
                if (this.model.usePostProcessing && !this.model.postFuncBody) {
                    this.model.postFuncBody = "return value;";
                } else if (!this.model.usePostProcessing && this.model.postFuncBody) {
                    delete this.model.postFuncBody;
                }
            }
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                value.type = this.model.type;
                value.name = this.model.name;
                value.label = this.model.label;
                value.color = this.model.color;
                value.units = this.model.units;
                value.decimals = this.model.decimals;
                value.funcBody = this.model.funcBody;
                if (!this.model.postFuncBody) {
                    delete value.postFuncBody;
                } else {
                    value.postFuncBody = this.model.postFuncBody;
                }
                ngModelCtrl.$setViewValue(value);
            }
        }, true);
    $compile($(this.element.nativeElement).contents())(this);
  }

  keysSearch(searchText?: any, ...rest: any[]): any {
    if (this.model.type === this.typesRef.dataKeyType.alarm) {
        var dataKeys: any = searchText ? this.alarmFields.filter(
            this.createFilterForDataKey(searchText)) : this.alarmFields;
        dataKeys.push(searchText);
        return dataKeys;
    } else {
        if (this.entityAlias()) {
            var deferred: any = $q.defer();
            this.fetchEntityKeys.emit({
                entityAliasId: this.entityAlias().id,
                query: searchText,
                type: this.model.type
            })
                .then(function (keys?: any) {
                    keys.push(searchText);
                    deferred.resolve(keys);
                }, function (e?: any) {
                    deferred.reject(e);
                });
            return deferred.promise;
        } else {
            return Promise.resolve([]);
        }
    }
    return undefined;
  }

  createFilterForDataKey(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = angular.lowercase(query);
    return function filterFn(dataKey?: any) {
        return (angular.lowercase(dataKey).indexOf(lowercaseQuery) === 0);
    };
  }
}
