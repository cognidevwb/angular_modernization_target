import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $mdUtil: any;
declare let $q: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntityTypeList` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-type-list',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, TranslatePipe],
  templateUrl: './tb-entity-type-list.directive.html',
})
export class TbEntityTypeListDirective {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly tbRequired = model<any>();
  readonly allowedEntityTypes = model<any>();
  readonly ignoreAuthorityFilter = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-chips, md-autocomplete, md-item-template, md-not-found, md-chip-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-chip-template left in place
  // TODO(port): template: 1 × md-chips left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × md-not-found left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  ngModelCtrl: any = ngModelCtrl;
  placeholder: any;
  secondaryPlaceholder: any;
  protected entityTypes: any;
  entityTypesList: any = [];
  $watch: any;
  entityTypeList: any;
  entityTypeListWatch: any;
  inputTouched: any;
  entityTypeSearchText = '';

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.placeholder = this.tbRequired() ? this.translate.instant('entity.enter-entity-type')
                                : this.translate.instant('entity.any-entity');
    this.secondaryPlaceholder = '+' + this.translate.instant('entity.entity-type');
    if (this.ignoreAuthorityFilter() && this.allowedEntityTypes()
            && this.allowedEntityTypes().length) {
            this.entityTypes = {};
            this.allowedEntityTypes().forEach((entityTypeValue?: any) => {
                var entityType: any = this.entityTypeFromValue(entityTypeValue);
                if (entityType) {
                    this.entityTypes[entityType] = entityTypeValue;
                }
            });
        } else {
            this.entityTypes = this.entityService.prepareAllowedEntityTypesList(this.allowedEntityTypes());
        }
    for (var type in this.entityTypes) {
            var entityTypeInfo: any = {};
            entityTypeInfo.value = this.entityTypes[type];
            entityTypeInfo.name = this.translate.instant(types.entityTypeTranslations[entityTypeInfo.value].type) + '';
            this.entityTypesList.push(entityTypeInfo);
        }
    this.$watch('tbRequired', () => {
            this.updateValidity();
        });
    ngModelCtrl.$render = function () {
            if (this.entityTypeListWatch) {
                this.entityTypeListWatch();
                this.entityTypeListWatch = null;
            }
            var entityTypeList: any = [];
            var value: any = ngModelCtrl.$viewValue;
            if (value && value.length) {
                value.forEach((type?: any) => {
                    var entityTypeInfo: any = {};
                    entityTypeInfo.value = type;
                    entityTypeInfo.name = this.translate.instant(types.entityTypeTranslations[entityTypeInfo.value].type) + '';
                    entityTypeList.push(entityTypeInfo);
                });
            }
            this.entityTypeList = entityTypeList;
            this.entityTypeListWatch = this.$watch('entityTypeList', (newVal?: any, prevVal?: any) => {
                if (!angular.equals(newVal, prevVal)) {
                    this.updateEntityTypeList();
                }
            }, true);
        }
    $compile($(this.element.nativeElement).contents())(this);
    $mdUtil.nextTick(() =>{
            var inputElement: any = $('input', $(this.element.nativeElement));
            inputElement.on('blur', () => {
                this.inputTouched = true;
            } );
        });
  }

  remove(entityType?: any): void {
    const index = this.entityTypeList ? this.entityTypeList.indexOf(entityType) : -1;
    if (index >= 0) {
        this.entityTypeList.splice(index, 1);
        this.updateEntityTypeList();
    }
  }

  onBlur(): void {
    this.inputTouched = true;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.entityTypeList) {
        this.entityTypeList = [];
    }
    this.entityTypeList.push(event.option.value);
    this.entityTypeSearchText = '';
    this.updateEntityTypeList();
  }

  entityTypeFromValue(entityTypeValue?: any, ...rest: any[]): any {
    for (var entityType in types.entityType) {
        if (types.entityType[entityType] === entityTypeValue) {
            return entityType;
        }
    }
    return null;
  }

  fetchEntityTypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var entityTypes: any = $filter('filter')(this.entityTypesList, {name: searchText});
    deferred.resolve(entityTypes);
    return deferred.promise;
  }

  updateValidity(...rest: any[]): any {
    var value: any = ngModelCtrl.$viewValue;
    var valid: any = !this.tbRequired() || value && value.length > 0;
    ngModelCtrl.$setValidity('entityTypeList', valid);
  }

  updateEntityTypeList(...rest: any[]): any {
    var values: any = ngModelCtrl.$viewValue;
    if (!values) {
        values = [];
        ngModelCtrl.$setViewValue(values);
    } else {
        values.length = 0;
    }
    if (this.entityTypeList && this.entityTypeList.length) {
        this.entityTypeList.forEach(function (entityType?: any) {
            values.push(entityType.value);
        });
    }
    this.updateValidity();
  }
}
