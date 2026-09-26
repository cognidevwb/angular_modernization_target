import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import entityListTemplate from '../../../../app/entity/entity-list.tpl.html';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $mdUtil: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntityList` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-list',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './tb-entity-list.directive.html',
})
export class TbEntityListDirective {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly tbRequired = model<any>();
  readonly entityType = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
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

  protected template: any = $templateCache.get(entityListTemplate);
  ngModelCtrl: any = ngModelCtrl;
  $watch: any;
  entityList: any;
  entityListDeregistration: any;
  entityTypeDeregistration: any;
  inputTouched: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.$watch('tbRequired', () => {
            this.updateValidity();
        });
    ngModelCtrl.$render = function () {
            this.destroyWatchers();
            var value: any = ngModelCtrl.$viewValue;
            this.entityList = [];
            if (value && value.length > 0) {
                this.entityService.getEntities(this.entityType(), value).then((entities?: any) => {
                    this.entityList = entities;
                    this.initWatchers();
                });
            } else {
                this.initWatchers();
            }
        }
    $compile($(this.element.nativeElement).contents())(this);
    $mdUtil.nextTick(() =>{
            var inputElement: any = $('input', $(this.element.nativeElement));
            inputElement.on('blur', () => {
                this.inputTouched = true;
            } );
        });
  }

  fetchEntities(searchText?: any, limit?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.entityService.getEntitiesByNameFilter(this.entityType(), searchText, limit, {ignoreLoading: true}).then(
        function success(result?: any) {
           if (result) {
               deferred.resolve(result);
           } else {
               deferred.resolve([]);
           }
        },
        function fail() {
           deferred.reject();
        }
    );
    return deferred.promise;
  }

  updateValidity(...rest: any[]): any {
    var value: any = ngModelCtrl.$viewValue;
    var valid: any = !this.tbRequired() || value && value.length > 0;
    ngModelCtrl.$setValidity('entityList', valid);
  }

  initWatchers(...rest: any[]): any {
    this.entityTypeDeregistration = this.$watch('entityType', (newEntityType?: any, prevEntityType?: any) => {
        if (!angular.equals(newEntityType, prevEntityType)) {
            this.entityList = [];
        }
    });
    this.entityListDeregistration = this.$watch('entityList', () => {
        var ids: any = [];
        if (this.entityList && this.entityList.length > 0) {
            for (var i: any=0;i<this.entityList.length;i++) {
                ids.push(this.entityList[i].id.id);
            }
        }
        var value: any = ngModelCtrl.$viewValue;
        if (!angular.equals(ids, value)) {
            ngModelCtrl.$setViewValue(ids);
        }
        this.updateValidity();
    }, true);
  }

  destroyWatchers(...rest: any[]): any {
    if (this.entityTypeDeregistration) {
        this.entityTypeDeregistration();
        this.entityTypeDeregistration = null;
    }
    if (this.entityListDeregistration) {
        this.entityListDeregistration();
        this.entityListDeregistration = null;
    }
  }
}
