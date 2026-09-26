import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TbRelationTypeAutocompleteDirective } from '../tb-relation-type-autocomplete/tb-relation-type-autocomplete.directive';
import { TbEntityTypeListDirective } from '../tb-entity-type-list/tb-entity-type-list.directive';

import $ from 'jquery';
import relationFiltersTemplate from '../../../../app/entity/relation/relation-filters.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbRelationFilters` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-relation-filters',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatButtonModule, FormsModule, forwardRef(() => TbRelationTypeAutocompleteDirective), forwardRef(() => TbEntityTypeListDirective)],
  templateUrl: './tb-relation-filters.directive.html',
})
export class TbRelationFiltersDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly allowedEntityTypes = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-form left in place

  protected template: any = $templateCache.get(relationFiltersTemplate);
  relationFilters: any = [];
  $watch: any;
  relationFiltersWatch: any;
  filter: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.addFilter = this.addFilter;
    this.removeFilter = this.removeFilter;
    ngModelCtrl.$render = function () {
            if (this.relationFiltersWatch) {
                this.relationFiltersWatch();
                this.relationFiltersWatch = null;
            }
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                this.relationFilters.length = 0;
                value.forEach((filter?: any) => {
                    this.relationFilters.push(filter);
                });
            }
            this.relationFiltersWatch = this.$watch('relationFilters', (newVal?: any, prevVal?: any) => {
                if (!angular.equals(newVal, prevVal)) {
                    this.updateValue();
                }
            }, true);
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  addFilter = (...rest: any[]): any => {
    var filter: any = {
        relationType: null,
        entityTypes: []
    };
    this.relationFilters.push(filter);
  };

  removeFilter = ($event?: any, filter?: any, ...rest: any[]): any => {
    var index: any = this.relationFilters.indexOf(filter);
    if (index > -1) {
        this.relationFilters.splice(index, 1);
    }
  };

  updateValue(...rest: any[]): any {
    var value: any = ngModelCtrl.$viewValue;
    if (!value) {
        value = [];
        ngModelCtrl.$setViewValue(value);
    } else {
        value.length = 0;
    }
    this.relationFilters.forEach(function (filter?: any) {
        value.push(filter);
    });
  }
}
